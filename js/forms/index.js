import $ from 'jquery'
import Gauntlet from 'motif-gauntlet'
import AjaxSubmission from 'motif-ajaxsubmission'
import Conditoner from "./motif.conditioner";

export default function () {
  initAjaxSubmission()
  initValidation()
  initConditioner()
}

function initAjaxSubmission () {
  $("[data-validation='ajax']").ajaxSubmission()
}
function initValidation () {
  $("[data-validation='true']").gauntlet()
}

function initConditioner () {
	$("[data-conditional-reveal], [data-conditional-conceal]").conditioner();
}