/************************************************************************
 * This file is part of pluscrm.
 *
 * pluscrm is an extended version of EspoCRM - see below - specifically 
* (but not exclusively) created for the German speaking market.
 * For more information please see http://www.pluscrm.eu or contact us
 * directly under support (at) pluscrm.eu. We are eager to hear your 
 * comments and suggestions.
 * Have fun!!!
 *
 ************************************************************************
 *
 * EspoCRM - Open Source CRM application.
 * Copyright (C) 2014-2015 Yuri Kuznetsov, Taras Machyshyn, Oleksiy Avramenko
 * Website: http://www.espocrm.com
 *
 * EspoCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * EspoCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EspoCRM. If not, see http://www.gnu.org/licenses/.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "EspoCRM" word.
 ************************************************************************/

Espo.define('views/record/detail-side', 'view', function (Dep) {

    return Dep.extend({

        template: 'record/side',

        mode: 'detail',

        readOnly: false,

        inlineEditDisabled: false,

        defaultPanel: false,
        
        streamPanel: true,
        
        memoPanel: true,
        
        activeMenuPanel: null,

        panelList: [],

        defaultPanelDefs: {
            name: 'default',
            label: false,
            view: 'views/record/panels/default-side',
            options: {
                fieldList: [
                    {
                        name: 'assignedUser',
                        view: 'views/fields/assigned-user'
                    },
                    {
                        name: 'teams',
                        view: 'views/fields/teams'
                    }
                ]
            }
        },

        data: function () {
            return {
                panelList: this.panelList,
                scope: this.scope,
                activeMenuPanel: this.activeMenuPanel
            };
        },

        events: {
            'click .action': function (e) {
                var $target = $(e.currentTarget);
                
                var action = $target.data('action');
                $target.tooltip('destroy');
                var panel = $target.data('panel');
                var data = $target.data();
                if (action) {
                    var method = 'action' + Espo.Utils.upperCaseFirst(action);
                    var d = _.clone(data);
                    delete d['action'];
                    delete d['panel'];
                    var view = this.getView(panel);
                    if (view && typeof view[method] == 'function') {
                        view[method].call(view, d);
                    }
                }
            },
        },

        init: function () {
            this.panelList = this.options.panelList || this.panelList;
            this.scope = this.options.model.name;
            
            this.activeMenuPanel = this.options.activeMenuPanel;

            this.recordHelper = this.options.recordHelper;

            this.panelList = Espo.Utils.clone(this.panelList);

            this.readOnlyLocked = this.options.readOnlyLocked || this.readOnly;
            this.readOnly = this.options.readOnly || this.readOnly;
            this.inlineEditDisabled = this.options.inlineEditDisabled || this.inlineEditDisabled;
            console.log("FOUND SIDE PANELS",this.panelList);
        },

        setupPanels: function () {
            var scope = this.scope;
            console.log('CHGECK IF MEMO PANEL IS  HERE','scopes.' + scope + '.memo',this.memoPanel,this.getMetadata().get('scopes.' + scope + '.memo'));
            if (this.streamPanel && this.getMetadata().get('scopes.' + scope + '.stream')) {
                this.setupStreamPanel();
            }
            
            
            if (this.memoPanel && this.getMetadata().get('scopes.' + scope + '.memo')) {
                this.setupMemoPanel();
            }
        },

        setupStreamPanel: function () {
            var streamAllowed = this.getAcl().checkModel(this.model, 'stream', true);
            if (streamAllowed === null) {
                this.listenToOnce(this.model, 'sync', function () {
                    streamAllowed = this.getAcl().checkModel(this.model, 'stream', true);
                    if (streamAllowed) {
                        this.showPanel('stream', function () {
                            this.getView('stream').collection.fetch();
                        });
                    }
                }, this);
            }
            if (this.mode === 'edit') 
                streamAllowed = false;
            
            if (streamAllowed !== false) {
                this.panelList.push({
                    "name":"stream",
                    "label":"Stream",
                    "view":"views/stream/panel",
                    "sticked": false
                });
            }
        },
        
        setupMemoPanel: function () {
            console.log("CHECK IF MEMO ALLOWED");
            var memoAllowed = this.getAcl().checkModel(this.model, 'memo', true);
            if (memoAllowed === null) {
                this.listenToOnce(this.model, 'sync', function () {
                    memoAllowed = this.getAcl().checkModel(this.model, 'memo', true);
                    if (memoAllowed) {
                        this.showPanel('memo', function () {
                            this.getView('memo').collection.fetch();
                        });
                    }
                }, this);
            }
            if (this.mode === 'edit') 
                memoAllowed = false;
            
            if (memoAllowed !== false) {
                /*this.panelList.push({
                    "name":"memo",
                    "label":"Memo",
                    "view":"crm:views/record/panels/memos",
                    "sticked": false
                });*/
            }
            console.log("CHECK IF MEMO ALLOWED FIISH",memoAllowed);
        },

        setup: function () {
            this.type = this.mode;
            if ('type' in this.options) {
                this.type = this.options.type;
            }

            if (this.defaultPanel) {
                this.setupDefaultPanel();
            }

            console.log("DETIAL_SIDE setup panels",this)
            console.log(this.setupPanels);
            this.setupPanels();
            
            console.log("INIT DETAIL_SIDE BEFORE ",this.panelList);

            var additionalPanels = this.getMetadata().get('clientDefs.' + this.scope + '.sidePanels.' + this.type) || [];
            additionalPanels.forEach(function (panel) {
                this.panelList.push(panel);
            }, this);

            this.panelList = this.panelList.filter(function (p) {
                if (p.aclScope) {
                    if (!this.getAcl().checkScope(p.aclScope)) {
                        return;
                    }
                }
                return true;
            }, this);

            this.panelList = this.panelList.map(function (p) {
                var item = Espo.Utils.clone(p);
                if (this.recordHelper.getPanelStateParam(p.name, 'hidden') !== null) {
                    item.hidden = this.recordHelper.getPanelStateParam(p.name, 'hidden');
                } else {
                    this.recordHelper.setPanelStateParam(p.name, item.hidden || false);
                }
                return item;
            }, this);
            console.log("BEFORE SETUP PANEL VIEWS ",this.panelList);
            this.setupPanelViews();
            
            console.log("INIT DETAIL_SIDE ",this.panelList);
        },

        setupDefaultPanel: function () {
            var met = false;
            this.panelList.forEach(function (item) {
                if (item.name === 'default') {
                    met = true;
                }
            }, this);

            if (met) return;

            var defaultPanelDefs = this.getMetadata().get(['clientDefs', this.scope, 'defaultSidePanel', this.type]);

            if (defaultPanelDefs === false) return;

            defaultPanelDefs = defaultPanelDefs || this.defaultPanelDefs;

            if (!defaultPanelDefs) return;

            defaultPanelDefs = Espo.Utils.cloneDeep(defaultPanelDefs);

            this.panelList.unshift(defaultPanelDefs);
        },

        setupPanelViews: function () {
            this.panelList.forEach(function (p) {
                console.log("SETUP PANEL SIDE", p.name, this.options.el);
                var o = {
                    model: this.options.model,
                    el: this.options.el + ' .panel[data-name="' + p.name + '"] > .panel-body',
                    readOnly: this.readOnly,
                    inlineEditDisabled: this.inlineEditDisabled,
                    mode: this.mode,
                    recordHelper: this.recordHelper,
                    defs: p,
                    disabled: p.hidden || false
                };
                
                o = _.extend(o, p.options);
                console.log("after extend", o);
                this.createView(p.name, p.view, o, function (view) {
                    if ('getButtonList' in view) {
                        p.buttonList = this.filterActions(view.getButtonList());
                    }
                    if ('getActionList' in view) {
                        p.actionList = this.filterActions(view.getActionList());
                    }
                    if (p.label) {
                        p.title = this.translate(p.label, 'labels', this.scope);
                    } else {
                        p.title = view.title;
                    }
                }, this);
                console.log("VIEW CREATED");
            }, this);
        },

        getFieldViews: function (withHidden) {
            var fields = {};
            this.panelList.forEach(function (p) {
                var panelView = this.getView(p.name);
                if ((!panelView.disabled || withHidden) && 'getFieldViews' in panelView) {
                    fields = _.extend(fields, panelView.getFieldViews());
                }
            }, this);
            return fields;
        },

        getFields: function () {
            return this.getFieldViews();
        },

        fetch: function () {
            var data = {};

            this.panelList.forEach(function (p) {
                var panelView = this.getView(p.name);
                if (!panelView.disabled && 'fetch' in panelView) {
                    data = _.extend(data, panelView.fetch());
                }
            }, this);
            return data;
        },

        filterActions: function (actions) {
            var filtered = [];
            actions.forEach(function (item) {
                if (Espo.Utils.checkActionAccess(this.getAcl(), this.model, item)) {
                    filtered.push(item);
                }
            }, this);
            return filtered;
        },

        showPanel: function (name, callback) {
            var isFound = false;
            this.panelList.forEach(function (d) {
                if (d.name == name) {
                    d.hidden = false;
                    isFound = true;
                }
            }, this);
            if (!isFound) return;

            this.recordHelper.setPanelStateParam(name, 'hidden', false);

            if (this.isRendered()) {
                var view = this.getView(name);
                if (view) {
                    view.$el.closest('.panel').removeClass('hidden');
                    view.disabled = false;
                }
                if (callback) {
                    callback.call(this);
                }
            } else {
                if (callback) {
                    this.once('after:render', function () {
                        callback.call(this);
                    }, this);
                }
            }
        },

        hidePanel: function (name, callback) {
            var isFound = false;
            this.panelList.forEach(function (d) {
                if (d.name == name) {
                    d.hidden = true;
                    isFound = true;
                }
            }, this);
            if (!isFound) return;

            this.recordHelper.setPanelStateParam(name, 'hidden', true);

            if (this.isRendered()) {
                var view = this.getView(name);
                if (view) {
                    view.$el.closest('.panel').addClass('hidden');
                    view.disabled = true;
                }
                if (callback) {
                    callback.call(this);
                }
            } else {
                if (callback) {
                    this.once('after:render', function () {
                        callback.call(this);
                    }, this);
                }
            }
        },
        
        afterRender: function() {
            if (this.type != 'detailSmall' && this.type != 'editSmall') {
                this.panelList.forEach(function (p) {
                    console.log("SETUP PANEL SIDE", p.name);
                    $('.panel[data-name="'+p.name+'"]').lobiPanel({
                        draggable: false, 
                        unpin: false, 
                        editTitle: false, 
                        close: false, 
                        reload: false, 
                        minimize: false,
                        disableTooltips: true,
                        expand: {
                            tooltip: this.translate('Fullscreen')
                        }
                    });

                    $('.panel[data-name="'+p.name+'"] .btn[data-toggle-tooltip="true"]').tooltip({
                        container: 'body',
                        template: '<div class="tooltip lobipanel-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
                    });
                }, this);
            }
        }

    });
});

