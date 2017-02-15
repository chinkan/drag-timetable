class TimetableDraggable {
  constructor(taskId, element, dragManager) {
    this.taskId = taskId;
    this.element = element;
    this.dragManager = dragManager;
    this.isDragging = false;
    this.element.onmousedown = this.onTouchStart.bind(this);
    window.addEventListener('mousemove', this.onTouchMove.bind(this), false);
    window.addEventListener('mouseup', this.onTouchEnd.bind(this), false);
  }

  onTouchStart(ev) {
    this.isDragging = true;
    this.startOffsetX = ev.offsetX;
    this.startOffsetY = ev.offsetY;
    this.currentGhostElement = this.element.cloneNode(true);
    this.currentGhostElement.style.position = 'absolute';
    this.currentGhostElement.style.left = (ev.pageX - this.startOffsetX) + "px";
    this.currentGhostElement.style.top = (ev.pageY - this.startOffsetY) + "px";
    this.currentGhostElement.style.width = this.element.clientWidth + "px";
    this.currentGhostElement.style.height = this.element.clientHeight + "px";
    document.body.appendChild(this.currentGhostElement);
    this.dragManager.spacer.moveStart(this.taskId);
    return false;
  }

  onTouchEnd(ev) {
    if (this.isDragging) {
      this.isDragging = false;
      if (this.currentGhostElement) {
        this.currentGhostElement.remove();
        this.currentGhostElement = null;
      }
      this.dragManager.spacer.moveEnd(this.taskId);
    }
  }

  onTouchMove(ev) {
    if (this.isDragging) {
      if (this.currentGhostElement) {
        this.currentGhostElement.style.left = (ev.pageX - this.startOffsetX) + "px";
        this.currentGhostElement.style.top = (ev.pageY - this.startOffsetY) + "px";
      }
      this.dragManager.spacer.moveUpdate(ev.pageY - this.startOffsetY - window.scrollY, this.taskId);
    }
  }
}

export default class TimetableDragManager {

  constructor(unitHeight, spacer) {
    this.unitHeight = unitHeight;
    this.spacer = spacer;
    this.taskElements = {};
  }

  attachToTaskElement(taskId, element) {
    const draggable = new TimetableDraggable(taskId, element, this);
    this.taskElements[taskId] = draggable;
  }

  detachToTaskElement(taskId, element) {

  }
}
