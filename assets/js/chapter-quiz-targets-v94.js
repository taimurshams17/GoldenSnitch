/* Golden Snitch v94 — visible, chapter-specific question-count targets.
 * Normal chapters target 80 questions; large chapters (22+ syllabus topics)
 * target 110. Existing banks above target are never reduced or padded. */
(function (w) {
  'use strict';
  var syllabus = w.CL_HSC_SYLLABUS_QUIZ_V79 || {};
  var STANDARD_TARGET = 80;
  var LARGE_TOPIC_THRESHOLD = 22;
  var LARGE_TARGET = 110;
  function resolve(chapterId, currentCount) {
    var chapter = syllabus[chapterId] || {};
    var topicCount = Array.isArray(chapter.topics) ? chapter.topics.length : 0;
    var isLarge = topicCount >= LARGE_TOPIC_THRESHOLD;
    var minimum = isLarge ? LARGE_TARGET : STANDARD_TARGET;
    var current = Math.max(0, Number(currentCount) || 0);
    var effective = Math.max(minimum, current);
    return {
      chapterId: chapterId,
      title: chapter.title || chapterId,
      syllabusTopicCount: topicCount,
      sizeClass: isLarge ? 'large' : 'standard',
      minimumTarget: minimum,
      effectiveTarget: effective,
      currentCount: current,
      remaining: Math.max(0, effective - current),
      progressPct: effective ? Math.min(100, Math.round(current / effective * 1000) / 10) : 0,
      policy: '80 per standard chapter; 110 for chapters with 22 or more supplied syllabus topics; retain any existing count above target'
    };
  }
  w.CL_HSC_QUESTION_TARGETS_V94 = {
    version: 94,
    standardTarget: STANDARD_TARGET,
    largeTarget: LARGE_TARGET,
    largeTopicThreshold: LARGE_TOPIC_THRESHOLD,
    resolve: resolve,
    all: function (counts) {
      return Object.keys(syllabus).map(function (id) { return resolve(id, counts && counts[id]); });
    }
  };
})(window);
