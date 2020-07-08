import $ from 'jquery'
import Gauntlet from 'motif-gauntlet'
import AjaxSubmission from 'motif-ajaxsubmission'
import SyncInput from './motif.sync-input'
import LoadingButton from './motif.loadingButton'

export default function () {
  initAjaxSubmission()
  initValidation()
  initSyncInput()
  initLoadingButtons()
}

function initAjaxSubmission() {
  $("[data-validation='ajax']").ajaxSubmission()
}

function initValidation() {
  $("[data-validation='true']").gauntlet()
}

function initSyncInput() {
  ;[].forEach.call(document.querySelectorAll('.js-sync-input'), el => {
    return new SyncInput(el, {
      dispatchChange: true
    })
  })
}

function initLoadingButtons() {
  ;[].forEach.call(document.querySelectorAll('.js-loading-button'), el => {
    return new LoadingButton(el, {})
  })
}
