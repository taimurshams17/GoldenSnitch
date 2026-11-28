(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var token = localStorage.getItem('clt') || '';
  var source = window.CL_HSC_SYLLABUS_QUIZ_V79 || {};
  var chapters = Object.keys(source).map(function (id) {
    var s = source[id] || {};
    return { id: id, title: s.title || id, subject: s.subject || '', paper: s.paper || '', topics: Array.isArray(s.topics) ? s.topics : [] };
  });
  var selected = chapters[0] && chapters[0].id, overrides = {}, publishedOverrides = {}, compiled = {}, editorialBlueprints = {}, editorialQueueLoaded = {}, editorialQueueLoading = {}, siteApi = null, editing = -1, toastTimer;
  var labels = { physics: 'Physics', chemistry: 'Chemistry', math: 'Higher Mathematics' };
  function E(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function notify(message, bad) { var t = $('toast'); t.textContent = message; t.className = 'on' + (bad ? ' bad' : ''); clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.className = ''; }, 3500); }
  function api(method, path, body) {
    return fetch('/api' + path, { method: method, headers: { 'content-type': 'application/json', authorization: 'Bearer ' + token }, body: body ? JSON.stringify(body) : undefined })
      .then(function (res) { return res.json().then(function (data) { if (!res.ok) throw new Error(data.error || ('HTTP ' + res.status)); return data; }); });
  }
  function makeSelect() {
    $('chapterSelect').innerHTML = chapters.map(function (c) { return '<option value="' + E(c.id) + '">' + E((labels[c.subject] || c.subject) + ' · ' + c.paper + ' · ' + c.title) + '</option>'; }).join('');
    if (selected) $('chapterSelect').value = selected;
    changeChapter();
  }
  function changeChapter() {
    selected = $('chapterSelect').value;
    var ch = chapters.find(function (c) { return c.id === selected; });
    if (!ch) return;
    $('chapterMeta').textContent = labels[ch.subject] + ' · ' + ch.paper + ' · ' + ch.title + ' · ' + ch.topics.length + ' syllabus topics';
    $('topicSelect').innerHTML = '<option value="">— Choose the closest exact syllabus topic —</option>' + ch.topics.map(function (t) { return '<option value="' + E(t) + '">' + E(t) + '</option>'; }).join('');
    $('search').value = '';
    resetForm(); renderList();
    loadEditorialQueueFor(selected);
  }
  function loadEditorialQueueFor(chapterId) {
    if (!siteApi || !chapterId || editorialQueueLoaded[chapterId] || editorialQueueLoading[chapterId]) return;
    editorialQueueLoading[chapterId] = true;
    $('frameStatus').textContent = 'Loading private editorial drafts for this chapter…';
    Promise.resolve(siteApi.editorialQueue(chapterId)).then(function (items) {
      editorialBlueprints[chapterId] = Array.isArray(items) ? items : [];
      editorialQueueLoaded[chapterId] = true;
      renderList();
      $('frameStatus').textContent = 'Loaded ' + (compiled[chapterId] || []).length + ' learner questions and ' + editorialBlueprints[chapterId].length + ' private editorial blueprints for ' + chapterId + '. Blueprints are not student-ready questions.';
    }).catch(function (err) {
      $('frameStatus').textContent = 'Private editorial queue unavailable: ' + String(err && err.message || 'Admin authentication required.');
    }).finally(function () { editorialQueueLoading[chapterId] = false; });
  }
  function draftRows() { return Array.isArray(overrides[selected]) ? overrides[selected] : (overrides[selected] = []); }
  function currentRows() { return Array.isArray(compiled[selected]) ? compiled[selected] : []; }
  function renderList() {
    var base = currentRows(), blueprints = Array.isArray(editorialBlueprints[selected]) ? editorialBlueprints[selected] : [], drafts = draftRows(), q = String($('search').value || '').toLowerCase();
    var publishedIds = Object.create(null); (Array.isArray(publishedOverrides[selected]) ? publishedOverrides[selected] : []).forEach(function (x) { if (x && x.id) publishedIds[x.id] = x; });
    var draftReplace = Object.create(null); drafts.forEach(function (x) { if (x.replaceId) draftReplace[x.replaceId] = true; });
    var publishedReplace = Object.create(null); (Array.isArray(publishedOverrides[selected]) ? publishedOverrides[selected] : []).forEach(function (x) { if (x && x.replaceId) publishedReplace[x.replaceId] = x; });
    var rows = base.map(function (x) { return { kind: 'base', item: x, replaced: draftReplace[x.id] || drafts.some(function (z) { return z.replaceId === x.id; }) }; });
    blueprints.forEach(function (x) { rows.push({ kind: 'blueprint', item: x, replaced: !!draftReplace[x.id], published: publishedReplace[x.id] || null }); });
    drafts.forEach(function (x, i) { rows.push({ kind: 'draft', item: x, index: i }); });
    var html = rows.filter(function (row) {
      var x = row.item; return !q || [x.q, x.topic, x.e, x.id].join(' ').toLowerCase().indexOf(q) >= 0;
    }).map(function (row) {
      var x = row.item, draft = row.kind === 'draft', blueprint = row.kind === 'blueprint';
      return '<article class="question-row ' + (draft ? 'draft-row' : (blueprint ? 'blueprint-row' : '')) + '"><div class="row-top"><span class="row-badge">' + (draft ? (publishedIds[x.id] ? 'Published · reviewed' : 'Admin draft · not reviewed') : (blueprint ? (row.published ? 'Blueprint replaced · published' : 'Editorial blueprint · rewrite/review required') : (x.meta && x.meta.contentOrigin === 'authored' ? 'Existing authored item' : 'Existing bank item'))) + '</span><span class="row-meta">' + E(x.id) + ' · Level ' + E(x.tier || 2) + '</span></div><p>' + E(x.q) + '</p>' + (blueprint ? '<p class="help blueprint-warning">Admin-only generated syllabus blueprint — hidden from learner practice. Rewrite the stem and all four options; verify the answer, calculation, distractors, explanation and source before reviewer approval.</p>' + ((x.editorialTriage && x.editorialTriage.flags && x.editorialTriage.flags.length) ? '<p class="help blueprint-warning"><b>Automated rewrite flags:</b> ' + E(x.editorialTriage.flags.join(' · ')) + '. These are pattern warnings, not an academic verdict.</p>' : '') : (x.blueprintDraft && !draft ? '<p class="help blueprint-warning">Generated syllabus blueprint — not a fully authored or approved question. Rewrite and verify the stem, all options, the answer key and explanation before publishing.</p>' : '')) + '<div class="row-meta"><span>' + E(x.topic || 'Topic tag not set') + '</span><span>·</span><span>' + E((x.o || []).length) + ' options</span>' + (row.replaced ? '<span>· Draft replacement saved</span>' : '') + (draft && publishedIds[x.id] ? '<span>· Reviewer: ' + E(publishedIds[x.id].editorialReviewer || 'Recorded') + '</span><span>· ' + E(publishedIds[x.id].editorialReviewedAt || '') + '</span>' : '') + '</div><div class="row-actions"><button class="secondary" ' + (blueprint ? 'data-edit-blueprint="' + E(x.id) + '"' : 'data-edit-base="' + E(x.id) + '"') + ' ' + (draft ? 'hidden' : '') + '>Edit / replace</button><button class="secondary" data-edit-draft="' + (draft ? row.index : '') + '" ' + (!draft ? 'hidden' : '') + '>Edit draft</button>' + (draft ? '<button class="danger" data-delete-draft="' + row.index + '">Delete draft</button>' : '') + '</div></article>';
    }).join('');
    $('questionList').innerHTML = html || '<p class="empty">No matching questions in this chapter.</p>';
    $('baseCount').textContent = base.length;
    $('draftCount').textContent = drafts.length;
    if ($('blueprintCount')) $('blueprintCount').textContent = blueprints.length;
    $('listStatus').textContent = rows.length + ' records · ' + blueprints.length + ' unreviewed blueprints';
    var meter = $('targetMeter');
    if (meter) {
      var newDrafts = drafts.filter(function (x) { return !x.replaceId; }).length;
      var activeCount = base.length + newDrafts;
      var target = window.CL_HSC_QUESTION_TARGETS_V94 ? window.CL_HSC_QUESTION_TARGETS_V94.resolve(selected, activeCount) : { minimumTarget: 75, remaining: Math.max(0, 75 - activeCount), progressPct: Math.min(100, activeCount / 75 * 100), sizeClass: 'standard' };
      meter.innerHTML = '<b>অধ্যায়ের প্রশ্নসংখ্যার লক্ষ্য</b><strong>' + activeCount + ' / ' + target.minimumTarget + '</strong><div class="admin-target-track"><span style="width:' + Math.min(100, target.progressPct) + '%"></span></div><small>' + (target.sizeClass === 'large' ? 'বড় অধ্যায় · ১১০টি লক্ষ্য' : 'সাধারণ অধ্যায় · ৭৫টি লক্ষ্য') + ' · ' + (target.remaining ? 'আরও ' + target.remaining + 'টি স্বতন্ত্র প্রশ্ন প্রয়োজন' : 'ন্যূনতম লক্ষ্য পূরণ') + '</small><em>প্রতিস্থাপন ড্রাফট নতুন প্রশ্নসংখ্যা হিসেবে গণনা করা হয় না।</em>'
    }
  }
  function resetForm() {
    editing = -1; $('questionForm').reset(); $('questionId').value = ''; $('draftIndex').value = '-1'; $('replaceId').value = '';
    $('editorTitle').textContent = 'Question editor'; $('questionForm').querySelector('[type="submit"]').textContent = 'Add to draft list'; if ($('reviewStatus')) $('reviewStatus').textContent = 'Select or save a question first. It must be saved as a draft before it can be published.';
  }
  function safeHttps(value) {
    try {
      var u = new URL(String(value || ''), window.location.href);
      return u.protocol === 'https:' && !u.username && !u.password ? u.href : '';
    } catch (e) { return ''; }
  }
  function previewMedia(targetId, items) {
    var target = $(targetId); if (!target) return;
    if (!items || !items.length) { target.innerHTML = '<span class="media-preview-empty">No external media added. The question-specific learning diagram is generated by the site.</span>'; return; }
    target.innerHTML = items.map(function (m) {
      var title = E(m.title || m.alt || m.type || 'Learning resource'), safeUrl = safeHttps(m.url), url = E(safeUrl);
      if (!safeUrl) return '<article class="media-preview-card is-invalid"><span class="media-preview-icon" aria-hidden="true">!</span><div><b>' + title + '</b><small>Only secure HTTPS resources can be previewed or saved.</small></div></article>';
      var thumb = m.type === 'image' || m.type === 'animation' || m.type === 'diagram' ? '<img loading="lazy" decoding="async" src="' + url + '" alt="' + E(m.alt || m.title || 'Media preview') + '">' : '<span class="media-preview-icon" aria-hidden="true">' + (m.type === 'video' ? '▶' : m.type === 'simulation' ? '⚗' : '↗') + '</span>';
      var rights = m.rightsStatus ? 'Rights: ' + E(m.rightsStatus) : 'Rights: not recorded';
      var credit = m.attribution ? ' · Attribution: ' + E(m.attribution) : '';
      var license = m.license ? ' · License: ' + E(m.license) : '';
      var licenseLink = m.licenseUrl && safeHttps(m.licenseUrl) ? ' · <a href="' + E(safeHttps(m.licenseUrl)) + '" target="_blank" rel="noopener noreferrer">License details</a>' : '';
      var transcript = m.transcriptUrl && safeHttps(m.transcriptUrl) ? ' · <a href="' + E(safeHttps(m.transcriptUrl)) + '" target="_blank" rel="noopener noreferrer">Transcript</a>' : '';
      return '<article class="media-preview-card">' + thumb + '<div><b>' + title + '</b><small>' + E(m.type) + ' · <a href="' + url + '" target="_blank" rel="noopener noreferrer">Open resource ↗</a></small><small class="media-preview-rights">' + rights + credit + license + licenseLink + transcript + '</small></div></article>';
    }).join('');
  }
  function renderFormMediaPreview() {
    function parse(id) { try { var data = JSON.parse($(id).value || '[]'); return Array.isArray(data) ? data : []; } catch (e) { return []; } }
    previewMedia('questionMediaPreview', parse('questionMediaJSON'));
    previewMedia('explanationMediaPreview', parse('explanationMediaJSON'));
  }
  function fillForm(q, idx, replacement) {
    editing = idx == null ? -1 : idx;
    $('questionId').value = q.id || '';
    $('draftIndex').value = String(editing);
    $('replaceId').value = replacement || q.replaceId || '';
    $('topicSelect').value = q.topic || '';
    $('questionText').value = q.q || '';
    (q.o || ['', '', '', '']).forEach(function (v, i) { $('option' + i).value = v || ''; });
    $('correct').value = String(Number(q.a) || 0); $('tier').value = String(q.tier || 2); var allowedQuestionTypes = ['conceptual','scenario','analytical','mathematical','experiment','assertion','graph','misconception','realWorld','multiStep']; $('questionType').value = allowedQuestionTypes.indexOf(q.questionType) >= 0 ? q.questionType : 'conceptual';
    var ex = q.explanation || {};
    $('exCore').value = ex.core || q.e || ''; $('exAnalysis').value = ex.analysis || ''; $('exFormula').value = ex.formula || '';
    $('exMisconception').value = ex.misconception || ''; $('exRealWorld').value = ex.realWorld || ''; $('exSimple').value = ex.simple || '';
    $('exSteps').value = Array.isArray(ex.steps) ? ex.steps.join('\n') : '';
    $('optionAnalysisJSON').value = JSON.stringify(Array.isArray(ex.optionAnalysis) ? ex.optionAnalysis : (Array.isArray(q.optionAnalysis) ? q.optionAnalysis : ['', '', '', '']), null, 2);
    $('questionMediaJSON').value = JSON.stringify((Array.isArray(q.media) ? q.media : []).filter(function (m) { return m && !m.html && m.url; }), null, 2);
    $('explanationMediaJSON').value = JSON.stringify((Array.isArray(ex.media) ? ex.media : []).filter(function (m) { return m && !m.html && m.url; }), null, 2);
    $('referencesJSON').value = JSON.stringify(Array.isArray(ex.references) ? ex.references : [], null, 2);
    renderFormMediaPreview();
    var ref = Array.isArray(ex.references) && ex.references[0] || {};
    $('refTitle').value = ref.title || ''; $('refUrl').value = ref.url || '';
    $('editorTitle').textContent = replacement || q.replaceId ? 'Rewrite / replace editorial blueprint' : 'Edit / replace current question';
    $('questionForm').querySelector('[type="submit"]').textContent = 'Update draft question';
    $('editorPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function formQuestion() {
    var refTitle = $('refTitle').value.trim(), refUrl = $('refUrl').value.trim(), refs = [];
    var refsRaw = $('referencesJSON').value.trim();
    if (refsRaw) { try { refs = JSON.parse(refsRaw); } catch (e) { throw new Error('References must be valid JSON.'); } }
    else if (refTitle || refUrl) refs.push({ title: refTitle, url: refUrl, institution: 'Source supplied by administrator; pending editorial verification' });
    if (!Array.isArray(refs) || refs.length > 5) throw new Error('References must be an array with no more than five items.');
    refs.forEach(function (r) { if (!r || typeof r.title !== 'string' || !r.title.trim() || typeof r.url !== 'string' || !/^https:\/\//i.test(r.url)) throw new Error('Every reference needs a title and an HTTPS URL.'); });
    function mediaArray(id, label) {
      var raw = $(id).value.trim(); if (!raw) return [];
      var list; try { list = JSON.parse(raw); } catch (e) { throw new Error(label + ' must be valid JSON.'); }
      if (!Array.isArray(list) || list.length > 6) throw new Error(label + ' must be an array with up to six items.');
      var allowed = label === 'Question media' ? ['image','diagram'] : ['image','animation','video','resource','link','diagram'];
      list.forEach(function (m) {
        if (!m || typeof m !== 'object' || Array.isArray(m) || !allowed.includes(m.type) || typeof m.url !== 'string' || !/^https:\/\//i.test(m.url)) throw new Error(label + (label === 'Question media' ? ' accepts static image/diagram items only; simulations, animation and video belong outside the question.' : ' item needs an allowed type and HTTPS URL.'));
        if (label === 'Question media' && /\.(gif|apng)(?:$|[?#])/i.test(m.url)) throw new Error('Animated GIF/APNG assets are not allowed in a question. Use a still image or static diagram.');
        if (Object.keys(m).some(function (k) { return ['html','srcdoc','embed','script'].includes(k); })) throw new Error(label + ' cannot contain HTML or embed code.');
        if (m.title != null && (typeof m.title !== 'string' || m.title.length > 200)) throw new Error(label + ' title is too long.');
        if (m.caption != null && (typeof m.caption !== 'string' || m.caption.length > 500)) throw new Error(label + ' caption is too long.');
        ['attribution','license','rightsStatus'].forEach(function (key) { if (m[key] != null && (typeof m[key] !== 'string' || m[key].length > 500)) throw new Error(label + ' ' + key + ' is too long.'); });
        ['licenseUrl','transcriptUrl'].forEach(function (key) { if (m[key] != null && !safeHttps(m[key])) throw new Error(label + ' ' + key + ' must be a secure HTTPS URL.'); });
        if (m.rightsStatus != null && !['owned','open-license','permission','public-domain','link-only','pending','not-assessed'].includes(m.rightsStatus)) throw new Error(label + ' rightsStatus is not supported.');
      });
      return list;
    }
    var questionMedia = mediaArray('questionMediaJSON', 'Question media');
    var explanationMedia = mediaArray('explanationMediaJSON', 'Explanation media');
    previewMedia('questionMediaPreview', questionMedia);
    previewMedia('explanationMediaPreview', explanationMedia);
    var id = $('questionId').value || ('admin-' + selected + '-' + Date.now().toString(36));
    var steps = $('exSteps').value.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    var core = $('exCore').value.trim();
    var optionAnalysis; try { optionAnalysis = JSON.parse($('optionAnalysisJSON').value || '[]'); } catch (e) { throw new Error('Option analysis must be valid JSON.'); }
    if (!Array.isArray(optionAnalysis) || optionAnalysis.length !== 4 || optionAnalysis.some(function (x) { return typeof x !== 'string' || x.trim().length < 25; })) throw new Error('Write a separate, substantive reason (at least 25 characters) for each of the four options.');
    var q = {
      id: id, replaceId: $('replaceId').value.trim(), topic: $('topicSelect').value, contentOrigin: 'admin-authored-rewrite', qualityStatus: 'draft-unreviewed',
      q: $('questionText').value.trim(), o: [0,1,2,3].map(function (i) { return $('option' + i).value.trim(); }),
      a: Number($('correct').value), tier: Number($('tier').value), questionType: $('questionType').value,
      e: core, media: questionMedia, qualityApproved: false, editorialReviewed: false,
      optionAnalysis: optionAnalysis, explanation: { core: core, analysis: $('exAnalysis').value.trim(), formula: $('exFormula').value.trim(), optionAnalysis: optionAnalysis,
        misconception: $('exMisconception').value.trim(), realWorld: $('exRealWorld').value.trim(), simple: $('exSimple').value.trim(), steps: steps, references: refs, media: explanationMedia }
    };
    if (q.q.length < 8) throw new Error('Question text must contain at least 8 characters.');
    if (q.o.some(function (o) { return !o; }) || new Set(q.o).size !== 4) throw new Error('Enter four distinct, non-empty answer options.');
    if (core.length < 60 || q.explanation.analysis.length < 100 || q.explanation.misconception.length < 25 || q.explanation.realWorld.length < 25 || steps.length < 3) throw new Error('A publish-ready draft needs a developed core, detailed analysis, misconception correction, real-world link and at least three solution steps.');
    return q;
  }
  function loadSiteBank() {
    var frame = $('compiledSource'), status = $('frameStatus'), tries = 0, queueLoading = false;
    frame.addEventListener('load', poll);
    function poll() {
      try {
        var api = frame.contentWindow && frame.contentWindow.CL_API;
        if (api && typeof api.quizBanks === 'function') {
          if (queueLoading) return;
          queueLoading = true;
          siteApi = api;
          var rows = api.quizBanks(); compiled = {};
          rows.forEach(function (row) { compiled[row.chapterId] = row.questions || []; });
          status.textContent = 'Loaded ' + rows.reduce(function (n, r) { return n + (r.questions || []).length; }, 0) + ' learner-bank records across ' + rows.length + ' chapters. Private editorial blueprints load per chapter after Admin authentication.';
          renderList();
          loadEditorialQueueFor(selected);
          queueLoading = false;
          return;
        }
      } catch (e) { status.textContent = 'Current site bank could not be read in this preview; draft editing is still available after deployment.'; return; }
      if (++tries < 120) setTimeout(poll, 250);
      else status.textContent = 'Current site bank did not finish loading. Draft questions can still be added manually.';
    }
    /* The iframe may have completed before this editor's async API request.
       Start polling immediately as well as listening for a later load event. */
    poll();
  }
  function loadDrafts() {
    if (!token) { notify('Sign in to the main Admin Panel first.', true); $('frameStatus').textContent = 'No admin token found. Sign in at /admin/ and reopen this page.'; return Promise.resolve(); }
    return api('GET', '/question-bank').then(function (data) { overrides = data.chapters || {}; publishedOverrides = data.publishedChapters || {}; Object.keys(overrides).forEach(function (id) { if (!Array.isArray(overrides[id])) overrides[id] = []; }); Object.keys(publishedOverrides).forEach(function (id) { if (!Array.isArray(publishedOverrides[id])) publishedOverrides[id] = []; }); renderList(); })
      .catch(function (err) { notify(err.message, true); $('frameStatus').textContent = 'Question Bank API unavailable. Deploy the Vercel Function and configure Supabase environment variables to enable cloud saving.'; });
  }
  function download(filename, value) {
    var blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = filename; a.click(); setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }
  $('questionMediaJSON').addEventListener('input', renderFormMediaPreview);
  $('explanationMediaJSON').addEventListener('input', renderFormMediaPreview);
  $('chapterSelect').addEventListener('change', changeChapter);
  $('search').addEventListener('input', renderList);
  $('newQuestion').addEventListener('click', function () { resetForm(); $('editorPanel').scrollIntoView({ behavior: 'smooth', block: 'start' }); $('questionText').focus(); });
  $('cancelEdit').addEventListener('click', resetForm);
  $('questionList').addEventListener('click', function (ev) {
    var base = ev.target.closest('[data-edit-base]'), blueprint = ev.target.closest('[data-edit-blueprint]'), draft = ev.target.closest('[data-edit-draft]'), del = ev.target.closest('[data-delete-draft]');
    if (base) { var q = currentRows().find(function (x) { return x.id === base.dataset.editBase; }); if (q) fillForm(q, -1, q.id); }
    if (blueprint) { var bq = (editorialBlueprints[selected] || []).find(function (x) { return x.id === blueprint.dataset.editBlueprint; }); if (bq) fillForm(bq, -1, bq.id); }
    if (draft) { var idx = Number(draft.dataset.editDraft); if (Number.isInteger(idx) && draftRows()[idx]) fillForm(draftRows()[idx], idx, draftRows()[idx].replaceId); }
    if (del) { var di = Number(del.dataset.deleteDraft); if (Number.isInteger(di)) { draftRows().splice(di, 1); renderList(); notify('Draft removed locally. Save to publish this change.'); } }
  });
  $('questionForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    try { var q = formQuestion(); if (editing >= 0 && draftRows()[editing]) draftRows()[editing] = q; else draftRows().push(q); resetForm(); renderList(); notify('Added to local draft list. Press “Save draft changes” to store it in the admin database.'); }
    catch (err) { notify(err.message, true); }
  });

  $('publishCurrent').addEventListener('click', function () {
    var idx = Number($('draftIndex').value), draft = idx >= 0 ? draftRows()[idx] : null;
    if (!draft || !draft.id) { notify('Select a saved draft question in the list first.', true); return; }
    var reviewer = $('reviewerName').value.trim();
    var attestations = {
      answer: $('reviewAnswer').checked, reasoning: $('reviewReasoning').checked,
      syllabus: $('reviewSyllabus').checked, distractors: $('reviewDistractors').checked,
      references: $('reviewReferences').checked, questionMedia: $('reviewQuestionMedia').checked,
      explanationMedia: $('reviewExplanationMedia').checked
    };
    if (reviewer.length < 10) { notify('Enter the reviewer name and qualification / institution (at least 10 characters).', true); $('reviewerName').focus(); return; }
    if (!attestations.answer || !attestations.reasoning || !attestations.syllabus || !attestations.distractors || !attestations.references) {
      notify('Complete all five required academic review checks before publishing.', true); return;
    }
    if ((draft.media || []).length && !attestations.questionMedia) { notify('Question media must be checked for relevance and rights before publication.', true); return; }
    if ((draft.explanation && draft.explanation.media || []).length && !attestations.explanationMedia) { notify('Explanation media must be checked for relevance, accessibility and rights before publication.', true); return; }
    var button = $('publishCurrent'); button.disabled = true; button.textContent = 'Publishing reviewed item…';
    api('PUT', '/question-bank/publish', { chapterId: selected, questionId: draft.id, reviewer: reviewer, attestations: attestations })
      .then(function (result) {
        publishedOverrides[selected] = (publishedOverrides[selected] || []).filter(function (q) { return q.id !== draft.id && (!draft.replaceId || q.replaceId !== draft.replaceId); });
        publishedOverrides[selected].push(Object.assign({}, draft, { qualityApproved: true, editorialReviewed: true, qualityStatus: 'reviewed-approved', editorialReviewer: result.reviewer, editorialReviewedAt: result.reviewedAt, reviewAttestation: attestations }));
        renderList(); $('reviewStatus').textContent = 'Published after reviewer attestation at ' + result.reviewedAt + '. The public quiz reads only the approved collection.';
        notify('Reviewed question published to the public quiz.');
      })
      .catch(function (err) { notify(err.message, true); $('reviewStatus').textContent = err.message; })
      .finally(function () { button.disabled = false; button.textContent = 'Review and publish this saved draft'; });
  });
  $('saveAll').addEventListener('click', function () {
    $('saveAll').disabled = true; $('saveAll').textContent = 'Saving…';
    api('PUT', '/question-bank', { chapters: overrides }).then(function (r) { notify('Saved ' + r.questions + ' draft questions across ' + r.chapters + ' chapters. Editorial status remains draft.'); $('saveAll').textContent = 'Saved'; setTimeout(function () { $('saveAll').textContent = 'Save draft changes'; }, 1800); })
      .catch(function (err) { notify(err.message, true); $('saveAll').textContent = 'Save draft changes'; })
      .finally(function () { $('saveAll').disabled = false; });
  });
  $('exportAll').addEventListener('click', function () { download('golden-snitch-hsc-question-bank-drafts.json', { version: 1, exportedAt: new Date().toISOString(), chapters: overrides }); });
  $('importBtn').addEventListener('click', function () { $('importFile').click(); });
  $('importFile').addEventListener('change', function (ev) {
    var file = ev.target.files && ev.target.files[0]; if (!file) return;
    var reader = new FileReader(); reader.onload = function () { try { var parsed = JSON.parse(String(reader.result || '')); var candidate = parsed.chapters || parsed; if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) throw new Error('Invalid chapter object'); overrides = candidate; makeSelect(); renderList(); notify('Imported JSON into local editor. Save to store it.'); } catch (err) { notify(err.message, true); } ev.target.value = ''; }; reader.readAsText(file);
  });
  makeSelect();
  loadDrafts().then(loadSiteBank);
})();
