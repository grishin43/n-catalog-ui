function getCommentsElement(element, create?: any): any {
  const bo = element.businessObject;
  const docs = bo.get('documentation');
  let comments; // get comments node

  docs.some((d) => {
    return d.textFormat === 'text/x-comments' && (comments = d);
  }); // create if not existing

  if (!comments && create) {
    comments = bo.$model.create('bpmn:Documentation', {
      textFormat: 'text/x-comments'
    });
    docs.push(comments);
  }

  return comments;
}

function htmlToElements(html): any {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.childNodes;
}

function getComments(element): any {
  const doc = getCommentsElement(element);

  if (!doc || !doc.text) {
    return [];
  } else {
    return doc.text.split(/;\r?\n;/).map((str) => {
      return str.split(/:/, 2);
    });
  }
}

function setComments(element, comments, commandStack): any {
  const doc = getCommentsElement(element, true);
  doc.text = comments.map((c) => {
    return c.join(':');
  }).join(';\n;');
  commandStack.execute('properties-panel.update-businessobject', {
    element,
    businessObject: doc
  });
}

function addComment(element, author, str, commandStack): void {
  const comments = getComments(element);
  comments.push([author, str]);
  setComments(element, comments, commandStack);
}

function removeComment(element, comment, commandStack): void {
  const comments = getComments(element);
  let idx = -1;
  comments.some((c, i) => {
    const matches = c[0] === comment[0] && c[1] === comment[1];
    if (matches) {
      idx = i;
    }
    return matches;
  });
  if (idx !== -1) {
    comments.splice(idx, 1);
  }
  setComments(element, comments, commandStack);
}

function Comments(eventBus, overlays, commandStack): void {
  function toggleCollapse(element): void {
    const o = overlays.get({
      element,
      type: 'comments'
    })[0];
    const overlay = o && o.html;

    if (overlay) {
      const expanded = overlay.classList.contains('expanded');
      eventBus.fire('comments.toggle', {
        element,
        active: !expanded
      });

      if (expanded) {
        overlay.classList.remove('expanded');
      } else {
        overlay.classList.add('expanded');
        overlay.querySelector('textarea').focus();
      }
    }
  }

  function createCommentBox(element): void {
    const overlay = htmlToElements(Comments.OVERLAY_HTML)?.[0];
    overlay.querySelector('.toggle').addEventListener('click', (e) => {
      toggleCollapse(element);
    });
    const commentElsCount = overlay.querySelector('[data-comment-count]');
    const textarea = overlay.querySelector('textarea');
    const commentsEls = overlay.querySelector('.comments');

    function renderComments(): void {
      // clear innerHTML
      commentsEls.innerHTML = '';
      const comments = getComments(element);
      comments.forEach((val) => {
        const commentEl = htmlToElements(Comments.COMMENT_HTML)?.[0];
        commentEl.querySelector('[data-text]').innerText = val[1];
        commentEl.querySelector('[data-delete]').addEventListener('click', (e) => {
          e.preventDefault();
          removeComment(element, val, commandStack);
          renderComments();
          textarea.value = val[1];
        });
        commentsEls.append(commentEl);
      });
      if (comments.length) {
        overlay.classList.add('with-comments');
      } else {
        overlay.classList.remove('with-comments');
      }
      commentElsCount.innerText = comments.length ? '(' + comments.length + ')' : '';
      eventBus.fire('comments.updated', {
        comments
      });
    }

    textarea.addEventListener('keydown', (e) => {
      if (e.which === 13 && !e.shiftKey) {
        e.preventDefault();
        const comment = textarea.value;
        if (comment) {
          addComment(element, '', comment, commandStack);
          textarea.value = '';
          renderComments();
        }
      }
    }); // attach an overlay to a node

    overlays.add(element, 'comments', {
      position: {
        bottom: 10,
        right: 10
      },
      html: overlay
    });
    renderComments();
  }

  eventBus.on('shape.added', (event) => {
    const element = event.element;

    if (element.labelTarget || !element.businessObject.$instanceOf('bpmn:FlowNode')) {
      return;
    }

    defer(() => {
      createCommentBox(element);
    });
  });

  this.collapseAll = () => {
    overlays.get({
      type: 'comments'
    }).forEach((c) => {
      const html = c.html;

      if (html.is('.expanded')) {
        toggleCollapse(c.element);
      }
    });
  };

  this.show = () => {
    overlays.get({
      type: 'comments'
    }).forEach((c) => {
      c.html.classList.remove('hidden');
    });
  };

  this.hide = () => {
    overlays.get({
      type: 'comments'
    }).forEach((c) => {
      c.html.classList.add('hidden');
    });
  };
}

Comments.$inject = ['eventBus', 'overlays', 'commandStack'];
Comments.OVERLAY_HTML = '<div class="comments-overlay hidden">' + '<div class="toggle">' + '<span class="icon-comment"></span>' + '<span class="comment-count" data-comment-count></span>' + '</div>' + '<div class="content">' + '<div class="comments"></div>' + '<div class="edit">' + '<textarea tabindex="1" placeholder="Add a comment"></textarea>' + '</div>' + '</div>' + '</div>';
Comments.COMMENT_HTML = '<div class="comment">' + '<div data-text></div><a href class="delete icon-delete" data-delete></a>' + '</div>';

function defer(fn): void {
  setTimeout(fn, 0);
}

export default {
  __init__: ['comments'],
  comments: ['type', Comments]
};
