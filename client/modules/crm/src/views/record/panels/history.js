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

Espo.define('crm:views/record/panels/history', 'crm:views/record/panels/activities', function (Dep) {

    return Dep.extend({

        name: 'history',

        scopeList: ['Meeting', 'Call', 'Email', 'Task', 'Memo'],

        sortBy: 'dateStart',

        asc: false,

        rowActionsView: 'crm:views/record/row-actions/history',

        actionList: [
            {
                action: 'createActivity',
                label: 'Log Meeting',
                data: {
                    link: 'meetings',
                    status: 'Held',
                },
                acl: 'create',
                aclScope: 'Meeting',
            },
            {
                action: 'createActivity',
                label: 'Log Call',
                data: {
                    link: 'calls',
                    status: 'Held',
                },
                acl: 'create',
                aclScope: 'Call',
            },
            {
                action: 'archiveEmail',
                label: 'Archive Email',
                acl: 'create',
                aclScope: 'Email',
            },{
                action: 'createMemo',
                label: 'Create Memo',
                acl: 'create',
                aclScope: 'Memo'
            }
        ],

        listLayout: {
            'Meeting': {
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
            'Email': {
                rows: [
                    [
                        {name: 'ico', colClass: 'col-md-mini', view: 'crm:views/fields/ico'},
                        {name: 'name', colClass: 'col-md-3', link: true},
                        {name: 'status', colClass: 'col-md-1'},
                        {name: 'dateSent', colClass: 'col-md-1'},
                        {name: 'description', colClass: 'col-md-5', view: 'crm:views/fields/description'},
                        
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
            },
            'Memo': {
                rows: [
                    [
                        {name: 'ico', colClass: 'col-md-mini', view: 'crm:views/fields/ico'},
                        {name: 'name', colClass: 'col-md-3', link: true},
                        {name: 'status', colClass: 'col-md-1'},
                        {name: 'dateStart', colClass: 'col-md-1', view: 'views/fields/date'},
                        {name: 'description', colClass: 'col-md-6', view: 'crm:views/fields/description'}
                    ]
                ],
                buttonClass: 'col-md-buttons'
            }
        },

        where: {
            scope: false,
        },

        getArchiveEmailAttributes: function (data, callback) {
            data = data || {};
            var attributes = {
                dateSent: this.getDateTime().getNow(15),
                status: 'Archived',
                from: this.model.get('emailAddress'),
                to: this.getUser().get('emailAddress')
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
            callback.call(this, attributes);
        },

        actionArchiveEmail: function (data) {
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

            var viewName = this.getMetadata().get('clientDefs.' + scope + '.modalViews.edit') || 'views/modals/edit';

            this.getArchiveEmailAttributes(data, function (attributes) {
                this.createView('quickCreate', viewName, {
                    scope: scope,
                    relate: relate,
                    attributes: attributes
                }, function (view) {
                    view.render();
                    view.notify(false);
                    this.listenToOnce(view, 'after:save', function () {
                        this.collection.fetch();
                        this.model.trigger('after:relate');
                    }, this);
                });
            });
        },

        actionReply: function (data) {
            var id = data.id;
            if (!id) {
                return;
            }

            Espo.require('EmailHelper', function (EmailHelper) {
                var emailHelper = new EmailHelper(this.getLanguage(), this.getUser());

                this.notify('Please wait...');

                this.getModelFactory().create('Email', function (model) {
                    model.id = id;
                    this.listenToOnce(model, 'sync', function () {
                        var attributes = emailHelper.getReplyAttributes(model, data, this.getPreferences().get('emailReplyToAllByDefault'));
                        var viewName = this.getMetadata().get('clientDefs.Email.modalViews.compose') || 'views/modals/compose-email';
                        this.createView('quickCreate', viewName, {
                            attributes: attributes,
                        }, function (view) {
                            view.render(function () {
                                view.getView('edit').hideField('selectTemplate');
                            });

                            this.listenToOnce(view, 'after:save', function () {
                                this.collection.fetch();
                                this.model.trigger('after:relate');
                            }, this);

                            view.notify(false);
                        }.bind(this));
                    }, this);
                    model.fetch();
                }, this);
            }, this);
        },
        
        actionCreateMemo: function (data) {
            var self = this;
            var link = 'memos';
            var scope = 'Memo';
            var foreignLink = this.model.defs['links'][link].foreign;
            var relate = {
                    model: this.model,
                    link: foreignLink,
            };
            
            this.notify('Loading...');
                
            Promise.all([
                new Promise(function (resolve) {
                    if (this.model.name == 'Contact') {
                        var parentModel = this.model;
                        this.getModelFactory().create('Account', function (account) {
                            account.id = parentModel.get('accountId');
                            account.fetch().then(function () {
                                console.log("got account", account);
                                resolve(account);
                            }, function () {});
                        }, this);
                    }
                    else
                        resolve(null);
                }.bind(this))
            ]).then(function (account) {
                if (account != null && account.length > 0) {
                    account = account[0];
                    if (account != null) {
                        relate = [relate,{
                            model: account,
                            link: 'account',
                        }];
                    }
                }
                
                console.log("RELATE",relate);
                
                var viewName = this.getMetadata().get('clientDefs.' + scope + '.modalViews.edit') || 'views/modals/edit';
                this.createView('quickCreate', viewName, {
                    scope: scope,
                    relate: relate
                }, function (view) {
                    view.render();
                    view.notify(false);
                    this.listenToOnce(view, 'after:save', function () {
                        this.collection.fetch();
                        this.model.trigger('after:relate');
                    }, this);
                });
            }.bind(this));
        }
    });
});

