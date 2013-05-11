/**
 * Admin Actions
 * =============================================================================
 * 
 * Creating the `Admin` namespace
 * 
 * @todo 
 */

(function ( $, Admin, dust, undefined ) {

    "use strict";

    /**
     * Utilities
     * -----------------------------------------------------------------------------
     * 
     * General utilities that other functions might need to use
     * 
     * @todo 
     */

    Admin.utils = {

        /**
         * Init Plugin
         * For maximum convenience for the most basic plugin use cases, 
         * this takes a simple config and starts the `loadPlugin` process 
         * for you (if it knows that elements exist on the page)
         *
         * @param {Object} config Includes targetElems, pluginName, pluginSource, 
         *   pluginOptions (Object)
         */

        initPlugin: function ( config ) {

                // Basic plugin config
            var pluginConfig = {
                    name: config.pluginName,
                    url: config.pluginSource,
                    options: config.pluginOptions
                };

            // If the target elements exist...
            if ( config.targetElems.length ) {

                // ...start loading the plugin
                Admin.utils.loadPlugin( config.targetElems, pluginConfig );
            }
        },

        /**
         * Load Plugin
         * If you know you want to bind a plugin right after you get a 
         * script, this automates it for you by combinding `getScript` 
         * and `bindPlugin`
         */

        loadPlugin: function ( target, config ) {

            // Call `getScript` util, passing on plugin name, url, and creating a callback...
            Admin.utils.getScript( config.name, config.url, function loadPluginCallback() {

                // ...where we call the `bindPlugin` util, passing on the target elem, 
                // plugin name, and options
                Admin.utils.bindPlugin( target, config.name, config.options );
            });
        },

        /**
         * Get Script
         * A slightly altered version of jQuery's `$.getScript` that first 
         * checks if the plugin has been loaded
         * 
         * @todo Don't like that we're repeating the `typeof` conditional
         */

        getScript: function ( name, url, callback ) {

            // If the plugin has not been registered...
            if ( !$.fn[name] ) {

                // Use jQuery's `$.getScript`
                $.getScript( url, function getScriptCallback () {

                    // If a callback function was provided...
                    if ( typeof callback === "function" ) {

                        // ...run it
                        callback();
                    }
                });

            // If the plugin *has* been registered 
            // and a callback has been provided...
            } else if ( typeof callback === "function" ) {

                // ...run it
                callback();

            // Otherwise...
            } else {

                // ...return true
                return true;
            }
        },

        /**
         * Bind Plugin
         * Right now, a crazy simple way of initializing a plugin
         * and passing on options
         */

        bindPlugin: function ( target, plugin, options ) {

            // Ex: $("#elem").pluginName({ option: value });
            target[plugin]( options );
        }
    };

    // Admin.dust = {
    //     compileTemplate: function ( template ) {
    //         return dust.compile( template.output, template.name );
    //     },
    //     loadTemplate: function ( template ) {
    //         dust.loadSource( template );
    //     },
    //     build: function ( template, data ) {
    //         var result;

    //         dust.render( template, data, function dustRender( errors, output ) {
    //             result = output;
    //         });

    //         return result;
    //     },
    //     init: function ( template, data ) {
    //         Admin.dust.loadTemplate( Admin.dust.compileTemplate( template ) );

    //         return Admin.dust.build( template.name, data );
    //     }
    // };

    // Admin.templates = {
    //     testTemplate: {
    //         name: "test",
    //         output: [
    //             "<h1>{name}</h1>",
    //             "<p>What a dope.</p>"
    //         ].join("\n")
    //     },
    //     secondaryNav: {
    //         name: "secondaryNav",
    //         output: [
    //             "<ul class='unstyled vertical-nav {ulClass}'>",
    //                 "{#navigation}",
    //                     "<li>",
    //                         "<a href='{url}'>",
    //                             "{name}",
    //                         "</a>",
    //                     "</li>",
    //                 "{/navigation}",
    //             "</ul>"
    //         ].join("\n")
    //     }
    // };

    /**
     * AJAX Form Submission & Response
     * -----------------------------------------------------------------------------
     * 
     * Submits form via AJAX and gives user an inline response message
     * 
     * @todo Make options for more complex messaging
     */

    Admin.ajaxForm = {

        /**
         * Config
         */

        config: {
            error: false,
            provideMessage: true,
            successText: "Great! Your form has been submitted.",
            errorText: "There was an error submitting your form. Please contact the site's administrator.",
            alertClass: "alert panel",
            alertSuccessClass: "success",
            alertErrorClass: "error",
            messageLocation: "append",
            clearForm: true,
            fieldSuccessClass: "success",
            scrollElem: null,
            callback: null
        },

        /**
         * Init
         * Grabs config and passes it and form on to `onSubmit`
         */

        init: function ( config ) {
            var context = Admin.ajaxForm,
                thisForm = $(this),

                // If config are not supplied, pass an empty object
                settings = config || {};

            // Call the submission method, passing on this form and settings
            context.onSubmit.call( thisForm, settings );
        },

        /**
         * On Submit
         * Makes AJAX call, passing on config `afterSubmit` 
         * both on success and error
         */

        onSubmit: function ( config ) {
            var context = Admin.ajaxForm,
                settings = config,
                thisForm = $(this);

            // Make AJAX call
            $.ajax({
                type: thisForm.attr("method"),
                url: thisForm.attr("action"),
                data: decodeURIComponent( thisForm.serialize() ),
                cache: false,

                // If successful...
                success: function ajaxSuccess( data ) {

                    if ( settings.provideMessage ) {

                        // ...call the after-submission method
                        context.afterSubmit.call( thisForm, settings );
                    }

                    return data;
                },

                // If unsuccessful...
                error: function ajaxError( data ) {

                    if ( settings.provideMessage ) {

                        // ...set `error` to be true...
                        settings.error = true;

                        // ...then call the after-submission method
                        context.afterSubmit.call( thisForm, settings );
                    }

                    return data;
                }
            });
        },

        /**
         * After Submit
         * Gets built response, calls to reset form 
         * and place message, runs callback (if there)
         */

        afterSubmit: function ( config ) {
            var context = Admin.ajaxForm,
                thisForm = $(this),
                settings = $.extend( context.config, config ),

                // Call the method to build the response message
                responseMessage = context.buildMessage( settings );

            // If there was no error...
            if ( !settings.error ) {

                // ...call method to reset form
                context.resetForm.call( thisForm, settings );
            }

            // Call method to place response message
            context.placeMessage.call( thisForm, settings, responseMessage );

            // Then, if a callback function has been supplied...
            if ( typeof settings.callback === "function" ) {

                // ...call it, passing on this form as context
                settings.callback.call( thisForm );
            }
        },

        /**
         * Build Message
         * Builds message string with config
         * Returns string
         */

        buildMessage: function ( config ) {
            var message = '<div class="';

            // Build out the message using our options
            message += config.alertClass;
            message += ' ';
            message += config.error ? config.alertErrorClass : config.alertSuccessClass;
            message += '">';
            message += config.error ? config.errorText : config.successText;
            message += '</div>';

            // Return the message string
            return message;
        },

        /**
         * Reset Form
         * Resets form and removes success 
         * class from fields
         */

        resetForm: function ( config ) {
            var thisForm = $(this);

            if ( config.clearForm ) {

                // Reset this form
                thisForm[0].reset();

                // Remove "success" classes from form fields
                thisForm
                    .find("label")
                    .removeClass( config.fieldSuccessClass );
            }
        },

        /**
         * Place Message
         * Depending on where specified in config, 
         * places message
         */

        placeMessage: function ( config, message ) {
            var context = Admin.ajaxForm,
                thisForm = $(this),
                responseMessage = $(message);

            // If options tell us to prepend the message...
            if ( config.messageLocation === "prepend" ) {

                // ...place it at the top of the form
                thisForm.prepend( responseMessage );

            // If options tell us to append the message...
            } else if ( config.messageLocation === "append" ) {

                // ...place it at the bottom of the form
                thisForm.append( responseMessage );

            // If options tell us to place the message before...
            } else if ( config.messageLocation === "before" ) {

                // ...place it before the form
                thisForm.before( responseMessage );

            // If options tell us to place the message after...
            } else if ( config.messageLocation === "after" ) {

                // ...place it after the form
                thisForm.after( responseMessage );
            }

            context.goToMessage( config, responseMessage );
        },

        /**
         * Go To Message
         * Right now, crudely animates to placed message
         */

        goToMessage: function ( config, message ) {
            var context = Admin.ajaxForm,

                // If element isn't specified, scroll `html`/`body`
                scrollElem = config.scrollElem || $("html, body");

            scrollElem.animate({
                scrollTop: message.offset().top
            }, 500 );
            context.removeMessage( message );
        },

        /**
         * Remove Message
         * Right now, crudely removes message 
         * after timeout
         */

        removeMessage: function ( message ) {

            // After a few seconds, remove message
            setTimeout(function () {
                message.slideUp( 150 );
            }, 8000, function () {
                message.remove();
            });
        }
    };

    /**
     * Admin Nav
     * -----------------------------------------------------------------------------
     * 
     * [Description]
     * 
     * @todo 
     */

    Admin.verticalNav = {

        /**
         * Config
         */

        config: {
            navWrapper: $("#vertical-nav-wrapper"),
            backButton: $("#content-nav-back"),
            hideClass: "off-left",
            revealClass: "off-right",
            // template: Admin.templates.secondaryNav,
            url: "/slice/admin/sample-nav.php",
            navTypeConfig: {
                unread: "unread notification",
                read: "notification",
                data: "data",
                user: "user",
                published: "published status",
                unpublished: "unpublished status",
                pending: "pending status",
                folder: "has-children"
            }
        },

         /**
          * Init
          */

        init: function ( config ) {
            var context = Admin.verticalNav,
                settings = $.extend( true, {}, context.config, config || {} );

            // Call the nav hiding method
            context.hideNav( settings );
        },

        hideNav: function ( config ) {
            var context = Admin.verticalNav;

            // Find the wrapper's child, hide it with class
            config.navWrapper.children().addClass( config.hideClass );

            // Call the method to remove the old nav
            context.removeNav( config );
        },

        removeNav: function ( config ) {
            var context = Admin.verticalNav;

            // CRUDE: Wait for CSS Animation
            setTimeout(function () {

                // Clear out the html
                config.navWrapper.html("");

                // Call method to get new nav
                context.getNav( config );
            }, 250 );
        },

        getNav: function ( config ) {
            var context = Admin.verticalNav;

            // Via AJAX, get JSON string of new nav
            $.getJSON( config.url, function getNavJSON( data ) {
                context.buildNav( data, config );
            });
        },

        buildNav: function ( data, config ) {
            var context = Admin.verticalNav,
                items = "",
                button;

            // data.ulClass = config.revealClass;
            // items = Admin.dust.init( config.template, data );

            items += "<ul class='unstyled vertical-nav petite-text mtn ";
            items += config.revealClass;
            items += "'>";

            // Loop through each object, build new nav
            $.each( data.nav, function navlistItems ( i, item ) {
                items += "<li><a ";
                items += "class='";
                items += config.navTypeConfig[item.type];
                items += "' ";
                items += "href='";
                items += item.url;
                items += "'>";
                items += item.label;
                items += "</a></li>";
            });

            items += "</ul>";

            // Call method to place new nav
            context.placeNav( items, config );

            if ( data.back ) {
                button = context.buildBackButton( data.back, config );
                context.placeBackButton( button, config );
            } else {
                context.removeBackButton( config );
            }

            return items;
        },

        buildBackButton: function ( data, config ) {
            var button = "";

            button += "<a class='content-nav-back petite-text'";
            button += "href='" + data.url + "'";
            button += "data-icon='&#x2B05;'";
            button += "data-icon-position='before'>";
            button += "<b class='is-hidden'>Return to</b>";
            button += data.label;
            button += "<b class='is-hidden'>Menu</b>";
            button += "</a>";

            return button;
        },

        placeBackButton: function ( button, config ) {
            var context = Admin.verticalNav;

            // Append new nav in wrapper
            config.backButton.html( button );
        },

        removeBackButton: function ( config ) {
            config.backButton.html("");
        },

        placeNav: function ( nav, config ) {
            var context = Admin.verticalNav,
                newNav = $(nav);

            // Append new nav in wrapper
            config.navWrapper.append( newNav );

            // Call method to show new nav
            context.showNav( newNav, config );
        },

        showNav: function ( nav, config ) {

            // Browser glitch where we have to wait a split second
            // for animation to work
            requestTimeout(function waitToShowNav() {

                // Show it, yo
                nav.removeClass( config.revealClass );
            }, 1 );
        }
    };

    /**
     * Tables
     *
     * Creating and interacting with tables involves several steps and 
     * features. Generally speaking, here are the order of operations:
     *
     * loadTables
     * :   On page init, this feature looks for the Ajax 
     *     tables on the page and determines if it needs to be built on 
     *     the fly (by sending it to buildTables) or if the headers and 
     *     pagination simply need to be bound (by sending it to 
     *     bindTables)
     *
     * buildTables
     * :   Constructs table markup by fetching a JSON object containing 
     *     the table data and stringing it together. If needed, it 
     *     (re)constructs the table pagination (by calling the 
     *     buildTablePagination method) and calls the bindTables 
     *     method to make sure its headers and pagination links have 
     *     click events
     *
     * buildTablePagination
     * :   Builds the table pagination nav (it gets the number of pages 
     *     from that JSON object) and places it after the table (or 
     *     replaces the current one if it's reconstructing it)
     *
     * bindTables
     * :   This binds the table head links and pagination links to 
     *     click events that call the buildTables method with 
     *     specialized URLs. This binding method is re-initialized 
     *     when a table is reconstructed
     */

    /**
     * Load Tables
     * @type {Object}
     */

    Admin.loadTables = {
        config: {
            targetElems: $(".ajax-table")
        },

        // Init
        init: function ( config ) {
            var context = Admin.loadTables,
                newConfig = $.extend( true, {}, context.config, config || {} );

            // If the target table wrapper exists...
            if ( newConfig.targetElems.length ) {

                // Call method that gives instructions
                // for what to do with the table
                context.instructions( newConfig );
            }
        },

        // Instructions
        instructions: function ( config ) {
            var context = Admin.loadTables;

            // ...loop through each...
            config.targetElems.each( function prepEachTable () {
                var table = $(this),

                    // Check for on-page-load attribute
                    loadTable = table.attr("data-table-load"),
                    tableURL = Admin.buildURL.init.call( table );


                // If we are to load the table on load...
                if ( loadTable ) {

                    // Call the table building method
                    Admin.buildTables.init({
                        targetElems: table,
                        url: tableURL
                    });

                // Otherwise...
                } else {

                    // Bind the existing table
                    Admin.bindTables.init.call( table );
                }
            });
        }
    };

    /**
     * Build Tables
     * @type {Object}
     */

    Admin.buildTables = {
        config: {
            targetElems: $(".ajax-table"),
            headClass: "table-head",
            bodyClass: "table-body",
            url: "/slice/admin/sample-table.php"
        },

        // Init
        init: function ( config ) {
            var context = Admin.buildTables,
                settings = $.extend( true, {}, context.config, config || {} );

            // Get your table data
            context.getTable( settings );
        },

        // Get Table
        getTable: function ( config ) {
            var context = Admin.buildTables;

            // Via AJAX, get JSON string of new table
            $.getJSON( config.url, function getNavJSON( data ) {

                // Take that data and put it together
                context.buildTable( data, config );
            });
        },

        // Construct Table
        buildTable: function ( data, config ) {
            var context = Admin.buildTables,

                // Grab the previously registered total
                // number of pages
                oldTotal = config.targetElems.data("totalPages"),
                table = "";

            // Construct the table head
            table += context.buildHead( data, config );

            // Construct the table body
            table += context.buildBody( data, config );

            // If the number of pages is not the same as the new one...
            if ( oldTotal !== data.pages ) {

                // ...we need to rebuild the pagination
                Admin.buildTablePagination.init.call( config.targetElems, data.pages );

                // ...and register this new number of total pages
                config.targetElems.data( "totalPages", data.pages );
            }

            // Call method to place new table
            context.placeTable( table, config );
        },

        // Construct Table Head
        buildHead: function ( data, config ) {
            var context = Admin.buildTables,
                headers = "";

            headers += "<thead class='" + config.headClass + "'>";
            headers += "<tr>";

            // Loop through each object, build new table columns
            $.each( data.head, function tableRows ( i, column ) {

                headers += "<th>";
                headers += "<a class='" + column.sort + "' ";
                headers += "data-table-column='" + column.column + "' ";
                headers += "data-table-direction='" + column.direction + "' ";
                headers += "href='#'>";
                headers += column.label;
                headers += "</a>";
                headers += "</th>";

            });

            headers += "</tr>";
            headers += "</thead>";

            // Return string
            return headers;
        },

        // Construct Table Body
        buildBody: function ( data, config ) {
            var context = Admin.buildTables,
                rows = "";

            rows += "<tbody class='" + config.bodyClass + "'>";

            // Loop through each object, build new row
            $.each( data.rows, function tableRows ( i, row ) {
                rows += "<tr>";

                // Within each row, loop through the cells
                $.each( row, function tableCells ( i, cell ) {
                    rows += "<td>";
                    rows += cell;
                    rows += "</td>";
                });

                rows += "</tr>";
            });

            rows += "</tbody>";

            // Return string
            return rows;
        },

        // Place Table
        placeTable: function ( rows, config ) {
            var table = config.targetElems.find("table");

            // If a table does not already exist...
            if ( !table.length ) {

                // ...create one...
                table = $("<table></table>");

                // ...and prepend it to the wrapper
                table.prependTo( config.targetElems );
            }

            // Place the new table rows into the table
            table.html( rows );

            // Call method to bind table headers and pagination
            Admin.bindTables.init.call( config.targetElems );
        }
    };

    /**
     * Build Table Pagination
     * @type {Object}
     */

    Admin.buildTablePagination = {
        config: {
            paginationClass: "table-pagination",
            currentClass: "is-current"
        },

        // Private settings
        settings: {
            dataNamespace: "paginationTableSettings"
        },

        // Init
        init: function ( total, config ) {
            var context = Admin.buildTablePagination,
                table = $(this),
                newConfig = $.extend( true, {}, context.config, config || {} );

            // Set the config in the table's data
            table.data( context.settings.dataNamespace, newConfig );

            // Build the pages
            context.buildPages.call( table, total );
        },

        // Build Pages
        buildPages: function ( totalPages ) {
            var context = Admin.buildTablePagination,
                table = $(this),
                config = table.data( context.settings.dataNamespace ),
                pagination = "<ol class='pagination nav'>",
                i = 1;

            // Loop through total number of pages
            // and create list item strings
            for ( ; i <= totalPages; i += 1 ) {
                pagination += "<li>";
                pagination += "<a ";

                // If it's the first page...
                if ( i === 1 ) {

                    // ...make it the "current" page
                    pagination += "class='" + config.currentClass + "' ";
                }

                // NEED TO MAKE THIS REAL CONTENT
                pagination += "data-table-page='" + i + "' ";
                pagination += "href='#'>";
                pagination += i;
                pagination += "</a>";
                pagination += "</li>";
            }

            pagination += "</ol>";

            // Place the generated pagination
            context.placePagination.call( table, pagination );
        },

        // Place Pagination
        placePagination: function ( pagination ) {
            var context = Admin.buildTablePagination,
                table = $(this),
                config = table.data( context.settings.dataNamespace ),
                paginationWrapper = table.find( "." + config.paginationClass );

            // If a pagination wrapper doesn't already exist...
            if ( !paginationWrapper.length ) {

                // ...create it
                paginationWrapper = $("<div class='" + config.paginationClass + "'></div>");

                // Append it to the table wrapper
                paginationWrapper.appendTo( table );
            }

            // Place the pagination into its wrapper
            paginationWrapper.html( pagination );
            
            context.bindPagination( table );
        },

        // Bind Pagination
        bindPagination: function ( table ) {

            var context = Admin.buildTablePagination,

                // Retrieve Bind Table Settings
                settings = table.data( context.settings.dataNamespace ),

                // Find the pagination wrapper
                tablePagination = table.find( "." + settings.paginationClass ),

                // Access the pagination settings
                paginationSettings = table.data("paginationTableSettings");

            if ( !paginationSettings ) {
                table.data( "paginationTableSettings", context.config );
                paginationSettings = table.data("paginationTableSettings");
            }

            // Reset the "currentPage" variable
            tablePagination.data("currentPage", "");

            // When a link in the pagination is clicked...
            tablePagination.on( "click", "a", function tablePageClick ( event ) {

                var page = $(this),

                    // Retrieve the "currentPage" variable
                    currentPage = tablePagination.data("currentPage"),
                    pageURL = Admin.buildURL.init.call( table, {
                        "page": page.attr("data-table-page")
                    });

                // Early return if this page is already the current one
                if ( page.hasClass( paginationSettings.currentClass ) ) {
                    return false;
                }

                // If the "currentPage" setting does not yet exist...
                if ( !currentPage ) {

                    // ...just find the page with the current class
                    currentPage = tablePagination.find( "." + paginationSettings.currentClass );
                }

                // Remove the current class from the current page
                currentPage.removeClass( paginationSettings.currentClass );

                // Add that class to the just-clicked page
                page.addClass( paginationSettings.currentClass );

                // Register this "currentPage" change in the data
                tablePagination.data( "currentPage", page );

                // Rebuild the tables based on this page change
                Admin.buildTables.init({
                    targetElems: table,
                    url: pageURL
                });

                // Prevent default
                event.preventDefault();
            });
        }
    };

    /**
     * Bind Tables
     *
     * Bind table headers and pagination for click events
     * Build tables if necessary
     */

    Admin.bindTables = {

        config: {
            headClass: "table-head",
            bodyClass: "table-body",
            paginationClass: "table-pagination",
            currentClass: "is-current"
        },

        // Init
        init: function ( config ) {
            var context = Admin.bindTables,
                settings = $.extend( true, {}, context.config, config || {} ),
                tables = $(this);

            // If the target elements exist...
            if ( tables.length ) {

                // ...loop through them...
                tables.each( function prepEachTable() {
                    var table = $(this);

                    // Place settings into table data
                    table.data( "bindTableSettings", settings );

                    // Prep the tables
                    context.prepTables( table );

                    // Bind the headers
                    context.bindHeaders( table );
                });
            }
        },

        // Prep Tables
        prepTables: function ( table ) {
            var context = Admin.bindTables,
                urlConfig = table.data("urlConfig");

            if ( !urlConfig ) {
                urlConfig = Admin.buildURL.configURL( table );
            }
        },

        // Bind Headers
        bindHeaders: function ( table ) {
            var settings = table.data("bindTableSettings"),
                tableHead = table.find( "." + settings.headClass );

            // When a link in the header is clicked...
            tableHead.on( "click", "a", function ( event ) {
                var sortURL = Admin.buildURL.init.call( table, {
                    "column": $(this).attr("data-table-column"),
                    "direction": $(this).attr("data-table-direction")
                });

                // ...rebuild the table based on its URL
                // WOULD BE NICE TO HAVE A WAY TO CHECK 
                // IF THIS IS ALREADY THE "CURRENTLY SORTED"
                // COLUMN
                Admin.buildTables.init({
                    targetElems: table,
                    url: sortURL
                });

                // Prevent Default
                event.preventDefault();
            });
        }
    };

    Admin.filterTable = {
        config: {
            filterGroups: $(".table-filters"),
            filterTriggers: "[data-table-filter]"
        },

        init: function () {
            var context = Admin.filterTable;

            if ( context.config.filterGroups.length ) {
                context.config.filterGroups.on( "click", context.config.filterTriggers, function triggerFilter ( event ) {
                    var trigger = $(this),
                        triggerTarget = $( trigger.attr("href") ),
                        filterURL = Admin.buildURL.init.call( triggerTarget, {
                            "filter": trigger.attr("data-table-filter")
                        });

                    Admin.buildTables.init({
                        targetElems: triggerTarget,
                        url: filterURL
                    });

                    event.preventDefault();
                });
            }
        }
    };

    Admin.buildURL = {
        config: {},

        init: function ( object ) {
            var context = Admin.buildURL,
                table = $(this),
                settings = table.data("urlConfig"),
                url = "";

            if ( !settings ) {
                settings = context.configURL( table );
            }

            if ( object ) {
                settings = $.extend( true, {}, settings, object );
                table.data( "urlConfig", settings );
            }


            url += settings.url + "?";
            url += "page=" + settings.page + "&";
            url += "column=" + settings.column + "&";
            url += "direction=" + settings.direction + "&";
            url += "filter=" + settings.filter;

            console.log(url);
            return url;
        },

        configURL: function ( table ) {
            var urlConfig = {
                url: table.attr("data-table-url") || "",
                page: table.attr("data-table-page") || "",
                column: table.attr("data-table-column") || "",
                direction: table.attr("data-table-direction") || "",
                filter: table.attr("data-table-filter") || ""
            };
            table.data( "urlConfig", urlConfig );

            return urlConfig;
        }
    };

    /**
     * Admin Nav
     * -----------------------------------------------------------------------------
     * 
     * [Description]
     * 
     * @todo 
     */

    Admin.secondaryNavigation = {

        config: {
            verticalNavWrapper: $("#vertical-nav-wrapper"),
            navConfig: {}
        },

        init: function ( config ) {

            // Extend the settings, make sure we've got the latest
            var settings = $.extend( true, {}, this.config, config || {} ),
                context = Admin.secondaryNavigation;

            // REMOVE
            Admin.verticalNav.init( settings );

            context.bindClick( settings );
        },

        bindClick: function ( config ) {
            config.verticalNavWrapper.on( "click", ".has-children", function ( event ) {
                config.navConfig.url = $(this).attr("href");

                Admin.verticalNav.init.call( $(this), config.navConfig );

                event.preventDefault();
            });
        }
    };

    /**
     * Admin Nav
     * -----------------------------------------------------------------------------
     * 
     * [Description]
     * 
     * @todo 
     */

    Admin.secondaryNavBack = {

        config: {
            backButton: $("#content-nav-back"),
            navConfig: {
                hideClass: "off-right",
                revealClass: "off-left"
            }
        },

        init: function ( config ) {

            // Extend the settings, make sure we've got the latest
            var settings = $.extend( true, {}, this.config, config || {} ),
                context = Admin.secondaryNavBack;

            context.bindClick( settings );
        },

        bindClick: function ( config ) {
            config.backButton.on( "click", "a", function ( event ) {
                config.navConfig.url = $(this).attr("href");

                Admin.verticalNav.init.call( $(this), config.navConfig );

                event.preventDefault();
            });
        }
    };

    /**
     * Admin Nav
     * -----------------------------------------------------------------------------
     * 
     * [Description]
     * 
     * @todo 
     */

    Admin.contentSearch = {

        config: {
            searchForm: $("#content-search")
        },

        init: function ( config ) {

            // Extend the settings, make sure we've got the latest
            var settings = $.extend( true, {}, this.config, config || {} ),
                context = Admin.contentSearch;

            context.bindSubmit( settings );
        },

        bindSubmit: function ( config ) {
            var context = Admin.contentSearch;

            config.searchForm.on("submit", function onSearchSubmit() {
                context.onSubmit( config );
                return false;
            });
        },

        onSubmit: function ( config ) {
            var searchURL = config.searchForm.attr("action");

            Admin.verticalNav.init({
                url: searchURL
            });
        }
    };

    /**
     * Off Canvas
     * -----------------------------------------------------------------------------
     * 
     * Trigger the off-canvas sidebar
     * 
     * @todo 
     */

    Admin.offCanvas = {

        /**
         * Config
         */

        config: {
            targetElems: $(".canvas-trigger"),
            pluginName: "lb_reveal",
            pluginSource: "/resources/c/js/jquery.lb-reveal.min.js",
            pluginOptions: {
                "exclusive": "yes",
                "activeClass": "is-active",
                "visitedClass": "was-active"
            }
        },

        /**
         * Init
         */

        init: function ( config ) {

            // Extend the settings, make sure we've got the latest
            var settings = $.extend( true, {}, this.config, config || {} );

            // Init the Plugin
            Admin.utils.initPlugin( settings );
        }
    };

    /**
     * Data Icons
     * -----------------------------------------------------------------------------
     * 
     * In IE8 or browsers that don't support generated content, fake the [data-icon] 
     * pseudo element by placing `<i>` elements inline.
     * 
     * @todo The `.each` in `init` might need to be its own method?
     */

    Admin.dataIcons = {
        config: {
            ie8: $("html.lte8"),
            dataIcon: $("[data-icon]")
        },

        /**
         * Init
         * Checks if it needs to generate icons, loops through each instance
         * @param  {Object} config 
         */

        init: function ( config ) {
            var context = Admin.dataIcons,
                settings = $.extend( true, {}, context.config, config || {} );

            // Check if Modernizr can't find generated content, or if the browser 
            // is IE8, which is known to have issues with [data-icon] via CSS
            if ( (!Modernizr.generatedcontent || context.config.ie8.length) && context.config.dataIcon.length ) {

                // Loop through each [data-icon] instance on the page...
                context.config.dataIcon.each( function createIcons() {
                    var elem = $(this),

                        // Build a new icon
                        newIcon = context.buildIcon.call( elem, settings );

                    // Place the new icon
                    context.placeIcon.call( elem, newIcon, settings );
                });
            }
        },

        /**
         * Build Icons
         * Build the icon string with `<i>` and data attributes
         * @param  {Object} config
         * @return {String}
         */

        buildIcon: function ( config ) {
            var elem = $(this),
                icon = "";

            icon += "<i class='data-icon ";
            icon += elem.attr("data-icon-family");
            icon += "' aria-hidden='true'>";
            icon += elem.attr("data-icon");
            icon += "</i>";

            return icon;
        },

        /**
         * Place Icon
         * Places the icon to its parent element based on data attribute position
         * @param  {String} icon   
         * @param  {Object} config 
         */

        placeIcon: function ( icon, config ) {
            var elem = $(this),
                newIcon = $(icon),
                iconPosition = elem.attr("data-icon-position");

            // If it's "before" or "solo"...
            if ( iconPosition === "before" || iconPosition === "solo" ) {

                // ...prepend it
                newIcon.prependTo( elem );

            // If it's "after"...
            } else if ( iconPosition === "after" ) {

                // ...append it
                newIcon.appendTo( elem );
            }
        }
    };

    /**
     * Off Canvas
     * -----------------------------------------------------------------------------
     * 
     * Trigger the off-canvas sidebar
     * 
     * @todo 
     */

    Admin.contentTree = {

        /**
         * Config
         */

        config: {
            targetElems: $(".content-tree").find(".parent"),
            pluginName: "lb_reveal",
            pluginSource: "/resources/c/js/jquery.lb-reveal.min.js",
            pluginOptions: {
                "exclusive": "yes"
            }
        },

        /**
         * Init
         */

        init: function ( config ) {

            // Extend the settings, make sure we've got the latest
            var settings = $.extend( true, {}, this.config, config || {} );

            // Init the Plugin
            Admin.utils.initPlugin( settings );
        }
    };

    /**
     * Admin Actions Init
     * -----------------------------------------------------------------------------
     * 
     * [Description]
     * 
     * @todo 
     */

    Admin.init = function () {
        Admin.offCanvas.init();
        Admin.dataIcons.init();
        Admin.secondaryNavigation.init();
        Admin.secondaryNavBack.init();
        Admin.contentTree.init();
        Admin.contentSearch.init();
        Admin.loadTables.init();
        Admin.filterTable.init();

        // $("form").on( "submit", function ( event ) {
        //     Admin.ajaxForm.init.call( $(this), {
        //         scrollElem: $(".content-page")
        //     });
        //     event.preventDefault();
        // });
    };

    Admin.init();

}( jQuery, window.Admin = window.Admin || {}, window.dust ) );
