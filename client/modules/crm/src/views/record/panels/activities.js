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

Espo.define('crm:views/record/panels/activities', ['views/record/panels/relationship', 'multi-collection'], function (Dep, MultiCollection) {

    return Dep.extend({

        name: 'activities',

        template: 'crm:record/panels/activities',

        scopeList: ['Meeting', 'Call', 'Task'],

        sortBy: 'dateStart',

        serviceName: 'Activities',

        asc: false,

        rowActionsView: 'crm:views/record/row-actions/activities',

        actionList: [
            {
                action: 'createActivity',
                label: 'Schedule Meeting',
                data: {
                    link: 'meetings',
                    status: 'Planned',
                },
                acl: 'create',
                aclScope: 'Meeting',
            },
            {
                action: 'createActivity',
                label: 'Schedule Call',
                data: {
                    link: 'calls',
                    status: 'Planned',
                },
                acl: 'create',
                aclScope: 'Call',
            },
            {
                action: 'composeEmail',
                label: 'Compose Email',
                acl: 'create',
                aclScope: 'Email',
            },{
                action: 'createTask',
                label: 'Create Task',
                acl: 'create',
                aclScope: 'Task',
            }
        ],

        listLayout: {
            'Meeting': {
                rows: [
                    [
                        {name: 'ico', colClass: 'col-md-mini', view: 'crm:views/fields/ico'},
                        {name: 'name', colClass: 'col-md-3', link: true},
                        {name: 'status', colClass: 'col-md-1' },
                        {name: 'dateStart', colClass: 'col-md-1' },
                        {name: 'description', colClass: 'col-md-6', view: 'crm:views/fields/description'}
                    ]
                ],
                buttonClass: 'col-md-buttons'
            },
            'Call': {
                rows: [
                    [
                        {name: 'ico', colClass: 'col-md-mini', view: 'crm:views/fields/ico'},
                        {name: 'name', colClass: 'col-md-3', link: true},
                        {name: 'status', colClass: 'col-md-1'},
                        {name: 'dateStart', colClass: 'col-md-1'},
                        {name: 'description', colClass: 'col-md-6', view: 'crm:views/fields/description'}                        
                    ]
                ],
                buttonClass: 'col-md-buttons'
            },
            'Task': {
                rows: [
                    [
                        {name: 'ico', colClass: 'col-md-mini', view: 'crm:views/fields/ico'},
                        {name: 'name', colClass: 'col-md-3', link: true},
                        {name: 'status', colClass: 'col-md-1'},
                        {name: 'dateEnd', colClass: 'col-md-1'},
                        {name: 'description', colClass: 'col-md-5', view: 'crm:views/fields/description'},
                        {name: 'isOverdue', colClass: 'col-md-1', view: 'crm:views/task/fields/is-overdue'}
                    ]
                ],
                buttonClass: 'col-md-buttons'
            }
        },

        currentScope: false,

        events: _.extend({
            'click button.scope-switcher': function (e) {
                var $target = $(e.currentTarget);
                this.$el.find('button.scope-switcher').removeClass('active');
                $target.addClass('active');
                this.currentScope = $target.data('scope') || false;

                this.collection.where = [this.currentScope];

                this.listenToOnce(this.collection, 'sync', function () {
                    this.notify(false);
                }, this);
                this.notify('Loading...');
                this.collection.fetch();

                this.currentTab = this.currentScope || 'all';
                this.getStorage().set('state', this.getStorageKey(), this.currentTab);
            }
        }, Dep.prototype.events),

        data: function () {
            return {
                currentTab: this.currentTab,
                scopeList: this.scopeList,
                tabList: this.tabList
            };
        },

        getStorageKey: function () {
            return 'activities-' + this.model.name + '-' + this.name;
        },

        setup: function () {
            console.log("ACTIVITIES PANEL",this.events,this.getSelector());
            this.currentTab = this.getStorage().get('state', this.getStorageKey()) || 'all';

            if (this.currentTab != 'all') {
                this.currentScope = this.currentTab;
            }

            this.seeds = {};

            this.wait(true);
            var i = 0;
            this.scopeList.forEach(function (scope) {
                this.getModelFactory().getSeed(scope, function (seed) {
                    this.seeds[scope] = seed;
                    i++;
                    if (i == this.scopeList.length) {
                        this.wait(false);
                    }
                }.bind(this));
            }.bind(this));
            if (this.scopeList.length == 0) {
                this.wait(false);
            }


            this.tabList = [];
            this.scopeList.forEach(function (item) {
                if (this.getAcl().check(item)) {
                    this.tabList.push(item);
                }
            }, this);
        },

        afterRender: function () {
            var url = this.serviceName + '/' + this.model.name + '/' + this.model.id + '/' + this.name;

            this.collection = new MultiCollection();
            this.collection.seeds = this.seeds;
            this.collection.url = url;
            this.collection.where = [this.currentScope];
            this.collection.sortBy = this.sortBy;
            this.collection.asc = this.asc;
            this.collection.maxSize = this.getConfig().get('recordsPerPageSmall') || 5;
console.log("AFTER RENDER ACTIVTIIES",this.el,this.getSelector())
            this.listenToOnce(this.collection, 'sync', function () {
                this.createView('list', 'views/record/list-expanded', {
                    el: this.getSelector() + ' > .list-container',
                    pagination: false,
                    type: 'listRelationship',
                    rowActionsView: this.rowActionsView,
                    checkboxes: false,
                    collection: this.collection,
                    listLayout: this.listLayout
                }, function (view) {
                    view.render();

                    this.listenTo(view, 'after:save', function (m) {
                        this.fetchActivities();
                        this.fetchHistory();
                    }, this);
                }, this);
            }, this);
            var self = this;
            this.$el.parent().on('onFullScreen.lobiPanel', function (e) {
                self.reRender();
            });

            if (!this.defs.hidden) {
                this.collection.fetch();
            }
        },

        fetchHistory: function () {
            var parentView = this.getParentView();
            if (parentView) {
                if (parentView.hasView('history')) {
                    var collection = parentView.getView('history').collection;
                    if (collection) {
                        collection.fetch();
                    }
                }
            }
        },

        fetchActivities: function () {
            var parentView = this.getParentView();
            if (parentView) {
                if (parentView.hasView('activities')) {
                    var collection = parentView.getView('activities').collection;
                    if (collection) {
                        collection.fetch();
                    }
                }
            }
        },

        fetchActivitiesAndHistory: function () {

        },

        getCreateActivityAttributes: function (data, callback) {
            data = data || {};

            var attributes = {
                status: data.status
            };

            if (this.model.name == 'Contact') {
                if (this.model.get('accountId')) {
                    attributes.parentType = 'Account',
                    attributes.parentId = this.model.get('accountId');
                    attributes.parentName = this.model.get('accountName');
                }
            } else if (this.model.name == 'Lead') {
                attributes.parentType = 'Lead',
                attributes.parentId = this.model.id
                attributes.parentName = this.model.get('name');
            }
            if (this.model.name != 'Account' && this.model.has('contactsIds')) {
                attributes.contactsIds = this.model.get('contactsIds');
                attributes.contactsNames = this.model.get('contactsNames');
            }

            if (this.model.name == 'User') {
                attributes.assignedUserId = this.model.id;
                attributes.assignedUserName = this.model.get('name');
            }

            callback.call(this, attributes);
        },

        actionCreateActivity: function (data) {
            var self = this;
            var link = data.link;
            var scope = this.model.defs['links'][link].entity;
            var foreignLink = this.model.defs['links'][link].foreign;

            this.notify('Loading...');

            var viewName = this.getMetadata().get('clientDefs.' + scope + '.modalViews.edit') || 'views/modals/edit';

            this.getCreateActivityAttributes(data, function (attributes) {
                this.createView('quickCreate', viewName, {
                    scope: scope,
                    relate: {
                        model: this.model,
                        link: foreignLink,
                    },
                    attributes: attributes,
                }, function (view) {
                    view.render();
                    view.notify(false);
                    this.listenToOnce(view, 'after:save', function () {
                        this.model.trigger('after:relate');
                        this.collection.fetch();
                        this.fetchHistory();
                    }, this);
                }, this);
            });

        },

        getComposeEmailAttributes: function (data, callback) {
            data = data || {};
            var attributes = {
                status: 'Draft',
                to: this.model.get('emailAddress')
            };
            callback.call(this, attributes);
        },

        actionComposeEmail: function () {
            var self = this;
            var link = 'emails';
            var scope = 'Email';

            var relate = null;
            if ('emails' in this.model.defs['links']) {
                relate = {
                    model: this.model,
                    link: this.model.defs['links']['emails'].foreign
                };
            }

            this.notify('Loading...');

            this.getComposeEmailAttributes(null, function (attributes) {
                if (this.model.name == 'Contact') {
                    if (this.getConfig().get('b2cMode')) {
                        attributes.parentType = 'Contact';
                        attributes.parentName = this.model.get('name');
                        attributes.parentId = this.model.id;
                    } else {
                        if (this.model.get('accountId')) {
                            attributes.parentType = 'Account',
                            attributes.parentId = this.model.get('accountId');
                            attributes.parentName = this.model.get('accountName');
                        }
                    }
                } else if (this.model.name == 'Lead') {
                    attributes.parentType = 'Lead',
                    attributes.parentId = this.model.id
                    attributes.parentName = this.model.get('name');
                }
                if (~['Contact', 'Lead', 'Account'].indexOf(this.model.name) && this.model.get('emailAddress')) {
                    attributes.nameHash = {};
                    attributes.nameHash[this.model.get('emailAddress')] = this.model.get('name');
                }

                this.createView('quickCreate', 'views/modals/compose-email', {
                    relate: relate,
                    attributes: attributes
                }, function (view) {
                    view.render();
                    view.notify(false);
                    this.listenToOnce(view, 'after:save', function () {
                        this.collection.fetch();
                        this.model.trigger('after:relate');
                        this.fetchHistory();
                    }, this);
                }, this);
            });

        },

        actionRefresh: function () {
            this.collection.fetch();
        },

        actionSetHeld: function (data) {
            var id = data.id;
            if (!id) {
                return;
            }
            var model = this.collection.get(id);
            model.save({
                status: 'Held'
            }, {
                patch: true,
                success: function () {
                    this.collection.fetch();
                    this.fetchHistory();
                }.bind(this)
            });
        },

        actionSetNotHeld: function (data) {
            var id = data.id;
            if (!id) {
                return;
            }
            var model = this.collection.get(id);
            model.save({
                status: 'Not Held'
            }, {
                patch: true,
                success: function () {
                    this.collection.fetch();
                    this.fetchHistory();
                }.bind(this)
            });
        },
        
        actionCreateTask: function (data) {
            var self = this;
            var link = 'tasks';
            var scope = 'Task';
            var foreignLink = this.model.defs['links'][link].foreign;

            this.notify('Loading...');

            var viewName = this.getMetadata().get('clientDefs.' + scope + '.modalViews.edit') || 'views/modals/edit';

            this.createView('quickCreate', viewName, {
                scope: scope,
                relate: {
                    model: this.model,
                    link: foreignLink,
                }
            }, function (view) {
                view.render();
                view.notify(false);
                this.listenToOnce(view, 'after:save', function () {
                    this.collection.fetch();
                    this.model.trigger('after:relate');
                }, this);
            });

        }
    });
});

