export function renderBlock (elementId, html) {
  const element = document.getElementById(elementId)
  element.innerHTML = html;
}
type MessageType = {
  text: string;
  type: string;
}
type ActionType = {
  name: string;
  handler: () => void;
}

export function renderToast (message: MessageType, action: ActionType) {
  let messageText = ''
  
  if (message != null) {
    messageText = `
      <div id="info-block" class="info-block ${message.type}">
        <p>${message.text}</p>
        <button id="toast-main-action">${action?.name || 'Закрыть'}</button>
      </div>
    `
  }
  
  renderBlock(
    'toast-block',
    messageText
  )

  const button = document.getElementById('toast-main-action')
  if (button != null) {
    button.onclick = function() {
      if (action != null && action.handler != null) {
        action.handler()
      }
      renderToast(null, null)
    }
  }
}