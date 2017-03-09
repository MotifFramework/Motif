import $ from 'jquery'
import Gauntlet from 'motif-gauntlet'
import AjaxSubmission from 'motif-ajaxsubmission'

export default function () {
  initAjaxSubmission()
  initValidation()
}

function initAjaxSubmission () {
  $("[data-validation='ajax']").ajaxSubmission()
}
function initValidation () {
  $("[data-validation='true']").gauntlet()
}
