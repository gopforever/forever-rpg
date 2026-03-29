/* ============================================================
   Forever RPG Wiki — wiki.js
   Minimal vanilla JS: collapsible sidebar, TOC, search, scroll
   ============================================================ */

(function () {
  'use strict';

  /* ── Collapsible Sidebar Sections ─────────────────────── */
  function initCollapsible() {
    document.querySelectorAll('.wiki-sidebar-portal-header').forEach(function (header) {
      var body = header.nextElementSibling;
      var icon = header.querySelector('.toggle-icon');
      header.addEventListener('click', function () {
        var collapsed = body.classList.toggle('collapsed');
        if (icon) icon.textContent = collapsed ? '▶' : '▼';
      });
    });
  }

  /* ── TOC Auto-Generation ──────────────────────────────── */
  function initTOC() {
    var tocEl = document.getElementById('wiki-toc');
    if (!tocEl) return;

    var content = document.querySelector('.wiki-content');
    if (!content) return;

    // Support both h2[id] directly and h2 inside .article-section[id]
    var headings = [];
    content.querySelectorAll('h2, h3').forEach(function (h) {
      var id = h.id;
      if (!id) {
        var section = h.closest('.article-section');
        if (section && section.id) id = section.id;
      }
      if (id) headings.push({ el: h, id: id });
    });

    if (headings.length === 0) {
      tocEl.style.display = 'none';
      return;
    }

    var ol = document.createElement('ol');
    var currentLi = null;
    var subOl = null;
    var h2Count = 0;

    headings.forEach(function (entry) {
      var h = entry.el;
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + entry.id;
      a.textContent = h.textContent.replace(/\[edit\]/, '').trim();
      li.appendChild(a);

      if (h.tagName === 'H2') {
        h2Count++;
        currentLi = li;
        subOl = null;
        ol.appendChild(li);
      } else if (h.tagName === 'H3' && currentLi) {
        if (!subOl) {
          subOl = document.createElement('ol');
          currentLi.appendChild(subOl);
        }
        subOl.appendChild(li);
      }
    });

    if (h2Count < 2) {
      tocEl.style.display = 'none';
      return;
    }

    tocEl.appendChild(ol);
  }

  /* ── Active Nav Link ──────────────────────────────────── */
  function initActiveNav() {
    var path = window.location.pathname;
    var page = path.split('/').pop() || 'index.html';
    document.querySelectorAll('.wiki-topnav a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var hpage = href.split('/').pop();
      if (hpage === page || (page === '' && hpage === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  /* ── Search Box ───────────────────────────────────────── */
  function initSearch() {
    var form = document.getElementById('wiki-search-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = form.querySelector('input[type="search"]').value.trim();
      if (!q) return;
      alert('Search for "' + q + '" is not yet implemented.\n\nBrowse the wiki using the navigation links.');
    });
  }

  /* ── Smooth Scroll for anchor links ──────────────────── */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
    });
  }

  /* ── Init ─────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initCollapsible();
    initTOC();
    initActiveNav();
    initSearch();
    initSmoothScroll();
  });
})();
