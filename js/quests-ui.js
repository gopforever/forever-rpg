'use strict';

// ─── Quest Log UI ─────────────────────────────────────────────────────────────
// Renders the Quest Log panel (Available / Active / Completed tabs).
// Entry point: renderQuestLogPanel()

(function () {
  var _activeTab = 'available';

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function _coinsDisplay(copper) {
    if (!copper || copper <= 0) return '';
    var gold   = Math.floor(copper / 10000);
    var silver = Math.floor((copper % 10000) / 100);
    var cop    = copper % 100;
    var parts  = [];
    if (gold   > 0) parts.push(gold   + 'g');
    if (silver > 0) parts.push(silver + 's');
    if (cop    > 0) parts.push(cop    + 'c');
    return parts.join(' ');
  }

  function _rewardSummary(reward) {
    if (!reward) return '';
    var parts = [];
    if (reward.xp > 0) parts.push(reward.xp.toLocaleString() + ' XP');
    var coins = _coinsDisplay(reward.copper);
    if (coins) parts.push(coins);
    if (Array.isArray(reward.items) && reward.items.length > 0) {
      var itemNames = reward.items.map(function (entry) {
        var name = _itemName(entry.itemId);
        return entry.quantity > 1 ? entry.quantity + 'x ' + name : name;
      });
      parts.push(itemNames.join(', '));
    }
    return parts.length ? parts.join(' · ') : 'No reward';
  }

  function _zoneName(zoneId) {
    if (!zoneId) return '';
    if (typeof ZONES !== 'undefined' && ZONES[zoneId] && ZONES[zoneId].name) {
      return ZONES[zoneId].name;
    }
    return zoneId;
  }

  function _itemName(itemId) {
    if (typeof ITEMS !== 'undefined' && ITEMS[itemId] && ITEMS[itemId].name) {
      return ITEMS[itemId].name;
    }
    return itemId;
  }

  // ── Progress display ──────────────────────────────────────────────────────────

  function _progressHtml(quest, state) {
    if (!state || !quest) return '';
    var obj  = quest.objective;
    var prog = state.progress || {};

    switch (obj.type) {
      case 'kill': {
        var current = 0;
        if (obj.enemies && obj.enemies.length > 0) {
          var kc = (typeof GameState !== 'undefined' && GameState.killCounts) || {};
          for (var i = 0; i < obj.enemies.length; i++) {
            current += (kc[obj.enemies[i]] || 0);
          }
        } else {
          current = prog.zoneKills || 0;
        }
        var total = obj.count || 1;
        var pct   = Math.min(100, Math.round((current / total) * 100));
        return '<div class="quest-card-progress">' +
          '<span>' + current + ' / ' + total + ' kills</span>' +
          '<div class="quest-progress-bar-wrap"><div class="quest-progress-bar-fill" style="width:' + pct + '%"></div></div>' +
          '</div>';
      }

      case 'kill_all_types': {
        var killed = prog.killedTypes || {};
        var types  = obj.enemies || [];
        var kc2    = (typeof GameState !== 'undefined' && GameState.killCounts) || {};
        var checks = types.map(function (id) {
          var done   = (kc2[id] || 0) > 0 || !!killed[id];
          var enemy  = (typeof ENEMIES !== 'undefined' && ENEMIES[id]) ? ENEMIES[id] : null;
          var name   = enemy ? enemy.name : id;
          return '<span class="quest-kill-type' + (done ? ' done' : '') + '">' +
            (done ? '✓' : '○') + ' ' + name + '</span>';
        }).join('');
        return '<div class="quest-card-progress quest-kill-types">' + checks + '</div>';
      }

      case 'loot': {
        var lootCurrent = prog.looted || 0;
        var lootTotal   = obj.count || 1;
        var lootPct     = Math.min(100, Math.round((lootCurrent / lootTotal) * 100));
        return '<div class="quest-card-progress">' +
          '<span>' + lootCurrent + ' / ' + lootTotal + ' looted</span>' +
          '<div class="quest-progress-bar-wrap"><div class="quest-progress-bar-fill" style="width:' + lootPct + '%"></div></div>' +
          '</div>';
      }

      case 'reach_floor': {
        var floorCurrent = prog.floor || 0;
        var floorTotal   = obj.floor || 1;
        var floorPct     = Math.min(100, Math.round((floorCurrent / floorTotal) * 100));
        return '<div class="quest-card-progress">' +
          '<span>Floor reached: ' + floorCurrent + ' / ' + floorTotal + '</span>' +
          '<div class="quest-progress-bar-wrap"><div class="quest-progress-bar-fill" style="width:' + floorPct + '%"></div></div>' +
          '</div>';
      }

      case 'visit': {
        var visitCount = Array.isArray(prog.visited) ? prog.visited.length : 0;
        var visitTotal = obj.count || 1;
        var visitPct   = Math.min(100, Math.round((visitCount / visitTotal) * 100));
        return '<div class="quest-card-progress">' +
          '<span>' + visitCount + ' / ' + visitTotal + ' zones visited</span>' +
          '<div class="quest-progress-bar-wrap"><div class="quest-progress-bar-fill" style="width:' + visitPct + '%"></div></div>' +
          '</div>';
      }

      case 'inspect_ghosts': {
        var ghostCount = prog.inspected || 0;
        var ghostTotal = obj.count || 1;
        var ghostPct   = Math.min(100, Math.round((ghostCount / ghostTotal) * 100));
        return '<div class="quest-card-progress">' +
          '<span>' + ghostCount + ' / ' + ghostTotal + ' ghosts inspected</span>' +
          '<div class="quest-progress-bar-wrap"><div class="quest-progress-bar-fill" style="width:' + ghostPct + '%"></div></div>' +
          '</div>';
      }

      default:
        return '';
    }
  }

  // ── Tab: Available ────────────────────────────────────────────────────────────

  function _renderAvailable() {
    if (typeof getAvailableQuestsForZone !== 'function') {
      return '<div class="quest-empty">Quest system not loaded.</div>';
    }

    var zone       = (typeof GameState !== 'undefined') ? GameState.zone : null;
    var zoneQuests = zone ? getAvailableQuestsForZone(zone) : [];

    // Ghost-eligible quests available regardless of zone
    var ghostQuests = [];
    if (typeof QUESTS !== 'undefined') {
      ghostQuests = QUESTS.filter(function (q) {
        if (!q.ghostEligible) return false;
        var state = (typeof GameState !== 'undefined' && GameState.quests)
          ? GameState.quests[q.id]
          : null;
        return !state || state.status === 'available';
      });
    }

    // Combine, deduplicate by quest id
    var seenIds = new Set();
    var quests  = zoneQuests.concat(ghostQuests).filter(function (q) {
      if (seenIds.has(q.id)) return false;
      seenIds.add(q.id);
      return true;
    });

    if (quests.length === 0) {
      return '<div class="quest-empty">No quests available in this zone.</div>';
    }

    return quests.map(function (quest) {
      var rewardStr = _rewardSummary(quest.reward);
      return '<div class="quest-card">' +
        '<div class="quest-card-name">' + quest.name + '</div>' +
        '<div class="quest-card-desc">' + (quest.desc || '') + '</div>' +
        (rewardStr ? '<div class="quest-card-reward">\uD83C\uDF81 ' + rewardStr + '</div>' : '') +
        '<button class="quest-accept-btn" onclick="_questAccept(\'' + quest.id + '\')">Accept Quest</button>' +
        '</div>';
    }).join('');
  }

  // ── Tab: Active ───────────────────────────────────────────────────────────────

  function _renderActive() {
    if (typeof getActiveQuests !== 'function') {
      return '<div class="quest-empty">Quest system not loaded.</div>';
    }

    var activeQuests = getActiveQuests();

    if (activeQuests.length === 0) {
      return '<div class="quest-empty">No active quests.</div>';
    }

    return activeQuests.map(function (quest) {
      var state      = (typeof getQuestState === 'function') ? getQuestState(quest.id) : null;
      var zoneLabel  = quest.zone ? '<div class="quest-card-zone">' + _zoneName(quest.zone) + '</div>' : '';
      var progressHtml = _progressHtml(quest, state);
      var rewardStr  = _rewardSummary(quest.reward);
      return '<div class="quest-card">' +
        '<div class="quest-card-name">' + quest.name + '</div>' +
        zoneLabel +
        '<div class="quest-card-desc">' + (quest.desc || '') + '</div>' +
        progressHtml +
        (rewardStr ? '<div class="quest-card-reward">\uD83C\uDF81 ' + rewardStr + '</div>' : '') +
        '</div>';
    }).join('');
  }

  // ── Tab: Completed ────────────────────────────────────────────────────────────

  function _renderCompleted() {
    if (typeof getCompletedQuests !== 'function') {
      return '<div class="quest-empty">Quest system not loaded.</div>';
    }

    var completedQuests = getCompletedQuests();

    if (completedQuests.length === 0) {
      return '<div class="quest-empty">No quests completed yet.</div>';
    }

    return completedQuests.map(function (quest) {
      var zoneLabel = quest.zone ? '<div class="quest-card-zone">' + _zoneName(quest.zone) + '</div>' : '';
      var rewardStr = _rewardSummary(quest.reward);
      return '<div class="quest-card quest-card-completed">' +
        '<div class="quest-card-name">\u2713 ' + quest.name + '</div>' +
        zoneLabel +
        '<div class="quest-card-desc">' + (quest.desc || '') + '</div>' +
        (rewardStr ? '<div class="quest-card-reward">\uD83C\uDF81 ' + rewardStr + '</div>' : '') +
        '</div>';
    }).join('');
  }

  // ── Main render ───────────────────────────────────────────────────────────────

  function renderQuestLogPanel() {
    var container = document.getElementById('quest-log');
    if (!container) return;

    // Sync tab from global (set by tab button onclick handlers)
    if (typeof window !== 'undefined' && window._questLogActiveTab) {
      _activeTab = window._questLogActiveTab;
    }

    var tabs = [
      { id: 'available', label: '\uD83D\uDCCB Available' },
      { id: 'active',    label: '\u2694 Active' },
      { id: 'completed', label: '\u2713 Done' },
    ];

    var tabBar = tabs.map(function (t) {
      return '<button class="quest-log-tab-btn' + (_activeTab === t.id ? ' active' : '') + '"' +
        ' onclick="_questLogSwitchTab(\'' + t.id + '\')">' + t.label + '</button>';
    }).join('');

    var bodyHtml = '';
    if (_activeTab === 'available')  bodyHtml = _renderAvailable();
    else if (_activeTab === 'active') bodyHtml = _renderActive();
    else                              bodyHtml = _renderCompleted();

    container.innerHTML =
      '<div class="quest-log-tabs">' + tabBar + '</div>' +
      '<div class="quest-log-tab-content">' + bodyHtml + '</div>';
  }

  // Expose globals
  if (typeof window !== 'undefined') {
    window._questLogActiveTab = _activeTab;

    window._questLogSwitchTab = function (tabId) {
      window._questLogActiveTab = tabId;
      renderQuestLogPanel();
    };

    window._questAccept = function (questId) {
      if (typeof GameState !== 'undefined' && !GameState.quests) {
        if (typeof initQuests === 'function') initQuests();
      }
      if (typeof startQuest === 'function') startQuest(questId);
      renderQuestLogPanel();
    };

    window.renderQuestLogPanel = renderQuestLogPanel;
  }

  if (typeof module !== 'undefined') module.exports = { renderQuestLogPanel: renderQuestLogPanel };
})();
