/**
 * lifeBLUE pluging to match the tablesorter system
 * @copyright 2010 lifeBLUE Media
 * @author Joe Mills / Josh Guthrie
 */

(function($) {
    $.fn.lb_tablesorter = function(customOptions) {
        var options = $.extend({},$.fn.lb_tablesorter.defaultOptions, customOptions);
        this.each(function() {
            loadData();
            $tsort = $(this);
            $tsort.bind("reloadData", function() {
                loadData();
                if(options.scrollable)
                {
                    $(".content-page").scrollTo("#" + options.prefix + "Top", "slow", {offset : 0});
                }
            });
            $tsort.bind("resetPage", function() {
                options.currentPage = 0;
            });
            $("#" + options.prefix + "Increment").click(function() {
                if((( parseInt(options.currentPage) + 1) + 1 <= options.totalPages) && (( parseInt(options.currentPage) + 1) + 1 > 0)) {
                    options.currentPage = parseInt(options.currentPage) + 1;
                    loadData();
                    if(options.scrollable)
                    {
                        $(".content-page").scrollTo("#" + options.prefix + "Top", "slow", {offset : 0});
                    }
                }
                return false;
            });
            $("#" + options.prefix + "Decrement").click(function() {
                if((( parseInt(options.currentPage) + 1) - 1 <= options.totalPages) && (( parseInt(options.currentPage) + 1) - 1 > 0)) {
                    options.currentPage = parseInt(options.currentPage) - 1;
                    loadData();
                    if(options.scrollable)
                    {
                        $(".content-page").scrollTo("#" + options.prefix + "Top", "slow", {offset : 0});
                    }
                }
                return false;
            });
            $("#" + options.prefix + "CurrentPage").change(function() {
                var newPage = $("#" + options.prefix + "CurrentPage").val();
                if(newPage <= options.totalPages && newPage > 0) {
                    options.currentPage = parseInt(newPage) - 1;
                    loadData();
                    if(options.scrollable)
                    {
                        $(".content-page").scrollTo("#" + options.prefix + "Top", "slow", {offset : 0});
                    }
                }
            });
            $("#" + options.prefix + "RecsPerPage").change(function() {
                var tmp = options.recordsPerPage;
                options.recordsPerPage = $('#' + options.prefix + 'RecsPerPage').val();
                options.currentPage = Math.floor(options.currentPage * (tmp / options.recordsPerPage));
                loadData();
                if(options.scrollable)
                {
                    $(".content-page").scrollTo("#" + options.prefix + "Top", "slow", {offset : 0});
                }

                // store records per page value
                $.get('/admin/ajax/baseAjax/recordsPerPage.html', {num:options.recordsPerPage}, function(data){});

            });
            if(options.sortable) {
                $("." + options.prefix + "Header").click(function() {
                    var key = $(this).attr("id");

                    if(options.savedSortClass){
                        $("."+options.savedSortClass).removeClass('sort-ASC');
                        $("."+options.savedSortClass).removeClass('sort-DESC');
                    }

                    options.savedSortClass = $(this).attr("class");

                    if(options.sortKey == key)
                    {

                        //$('#' + sortKey + 'header').removeClass('ajaxTableHeadCell');

                        if(options.sortOrder == 'ASC')
                        {
                            options.sortOrder = 'DESC';
                        }
                        else
                        {
                            options.sortOrder = 'ASC';
                        }
                    }
                    else
                    {
                        //$('#' + sortKey + 'header').addClass('ajaxTableHeadCell');
                        options.sortOrder = 'ASC';
                    }

                    $(this).addClass('sort-'+options.sortOrder+'');

                    options.sortKey = key;

                    /*
                    $('#' + sortKey + 'header').removeClass('ajaxTableHeadCell');
                    $('#' + sortKey + 'header').removeClass('ajaxTableHeadCellASC');
                    $('#' + sortKey + 'header').removeClass('ajaxTableHeadCellDESC');
                    $('#' + sortKey + 'header').addClass('ajaxTableHeadCell' + sortOrder);
                    */

                    loadData();
                });
            }
        });

        function loadData()
        {
            openLoader();

            var parameters = '';
            var array = options.additionalParameters.split(',');

            for(var i=0; i<array.length; i++)
            {
                if(window[array[i]]==undefined)
                {
                    if(array[i] != "")
                    {
                        window[array[i]]="";
                    }
                }

                if(parameters != ''){
                    parameters += ", ";
                }

                parameters += array[i] + ': ' + window[array[i]];
            }

            if(options.usesPagination) {
                if(parameters != '') {
                    parameters += ", ";
                }
                parameters += 'currentPage: ' + options.currentPage + ', ';
                parameters += 'recordsPerPage: ' + options.recordsPerPage;
            }
            if(options.sortable) {
                if(options.usesPagination) {
                    parameters += ', ';
                }
                parameters += 'sortKey: ' + options.sortKey + ', ';
                parameters += 'sortOrder: ' + options.sortOrder + '';
            }

            $.post(options.ajaxUrl, {parameters: parameters},
                function(data) {
                    if(options.usesPagination) {
                        var totalCount = data.substring(0, data.indexOf('<'));
                        $('#' + options.prefix + 'TableBody').html(data.replace(totalCount, ''));
                        options.totalPages = Math.ceil(totalCount/options.recordsPerPage);
                        $('#' + options.prefix + 'TotalPages').html(options.totalPages);
                        $('#' + options.prefix + 'TotalCount').html(totalCount);
                        $('#' + options.prefix + 'CurrentPage').val(parseInt(options.currentPage) + 1);
                        if((parseInt(options.currentPage) + 1) != options.totalPages && options.totalPages != 0) {
                            $('#' + options.prefix + 'Increment').removeClass("is-disabled");
                        } else {
                            $('#' + options.prefix + 'Increment').addClass("is-disabled");
                        }
                        if(options.currentPage != '0') {
                            $('#' + options.prefix + 'Decrement').removeClass("is-disabled");
                        } else {
                            $('#' + options.prefix + 'Decrement').addClass("is-disabled");
                        }
                        for(var i = 0; i<options.totalPages; i++) {
                            //$('#' + options.prefix + 'RecsPerPage').append('<option value=' + (i + 1) + '>' + (i + 1) + '</option>');
                        }
                        $('#' + options.prefix + 'CurrentPage').val(parseInt(options.currentPage) + 1);
                    } else {
                        $('#' + options.prefix + 'TableBody').html(data);
                    }
                    $("<a></a>").lb_overlay("close");
                }
            );
        }

        function openLoader()
        {
            if( options.loaderType == "simple" )
            {
                //
            }
            else
            {
                $("<a></a>").lb_overlay().click();
            }
        }

//      function sortBy(key)
//      {
//          /*
//          $('#' + sortKey + 'header').removeClass('ajaxTableHeadCell');
//          $('#' + sortKey + 'header').removeClass('ajaxTableHeadCellASC');
//          $('#' + sortKey + 'header').removeClass('ajaxTableHeadCellDESC');
//          */
//
//          if(options.sortKey == key)
//          {
//              //$('#' + sortKey + 'header').removeClass('ajaxTableHeadCell');
//
//              if(options.sortOrder == 'ASC')
//              {
//                  options.sortOrder = 'DESC';
//              }
//              else
//              {
//                  options.sortOrder = 'ASC';
//              }
//          else
//          {
//              //$('#' + sortKey + 'header').addClass('ajaxTableHeadCell');
//              options.sortOrder = 'ASC';
//          }
//
//          }
//          options.sortKey = key;
//
//          /*
//          $('#' + sortKey + 'header').removeClass('ajaxTableHeadCell');
//          $('#' + sortKey + 'header').removeClass('ajaxTableHeadCellASC');
//          $('#' + sortKey + 'header').removeClass('ajaxTableHeadCellDESC');
//          $('#' + sortKey + 'header').addClass('ajaxTableHeadCell' + sortOrder);
//          */
//
//          loadData();
//      }
//
//      function jumpToPage()
//      {
//          var newPage = $('#' + options.prefix + 'CurrentPage').val();
//
//          if(newPage <= options.totalPages && newPage > 0)
//          {
//              options.currentPage = newPage - 1;
//              loadData();
//          }
//      }
//
//      function incrementPage(number)
//      {
//          if(((options.currentPage + 1) + number <= options.totalPages) && ((options.currentPage + 1) + number > 0))
//          {
//              options.currentPage = options.currentPage + number;
//              loadData();
//          }
//      }
//
//      function setRecordsPerPage()
//      {
//          var tmp = options.recordsPerPage;
//          options.recordsPerPage = $('#' + options.prefix + 'RecsPerPage').val();
//          options.currentPage = Math.floor(options.currentPage * (tmp / options.recordsPerPage));
//          loadData();
//      }
    }
    $.fn.lb_tablesorter.defaultOptions = {
        prefix : '',
        ajaxUrl : '',
        sortKey : '',
        additionalParameters : '',
        currentPage : '0',
        recordsPerPage : '',
        totalPages : '0',
        sortOrder : 'ASC',
        sortable : false,
        loaderType : '',
        usesPagination : false,
        savedSortClass: ''
    };
})(jQuery);
