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

Espo.define('crm:views/record/panels/memos', 'views/record/panels/relationship', function (Dep) {

    return Dep.extend({

        name: 'memos',

        template: 'crm:record/panels/memos',

        tabList: [],

        defaultTab: 'all',

        sortBy: 'createdAt',

        asc: false,

        buttonList: [
            {
                action: 'createMemo',
                title: 'Create Memo',
                acl: 'create',
                aclScope: 'Memo',
                html: '<span class="glyphicon glyphicon-plus"></span>',
            }
        ],

        listLayout: {
            rows: [
                [
                    {
                        name: 'name',
                        link: true,
                    },
                    {name: 'type'},
                    {name: 'date'}
                ]
            ]
        },


        events: _.extend({
            'click button.tab-switcher': function (e) {
                var $target = $(e.currentTarget);
                this.$el.find('button.tab-switcher').removeClass('active');
                $target.addClass('active');

                this.currentTab = $target.data('tab');

                this.collection.where = this.where = [
                    {
                        type: 'enum',
                        name: 'type',
                        value: this.currentTab
                    }
                ];

                this.listenToOnce(this.collection, 'sync', function () {
                    this.notify(false);
                }.bind(this));
                this.notify('Loading...');
                this.collection.fetch();

                this.getStorage().set('state', this.getStorageKey(), this.currentTab);
            }
        }, Dep.prototype.events),

        data: function () {
            return {
                currentTab: this.currentTab,
                tabList: this.tabList
            };
        },

        getStorageKey: function () {
            return 'memos-' + this.model.name + '-' + this.name;
        },
    

        setup: function () {
            this.scope = this.model.name;

            var typeOptions = this.getMetadata().get('entityDefs.Memo.fields.type.options') || [];
            typeOptions = typeOptions.filter(function (p) {
                if (p.length == 0)
                    return;
                return true;
            }, this);
            this.tabList = ['all'].concat(typeOptions);   
            this.currentTab = this.getStorage().get('state', this.getStorageKey()) || this.defaultTab;

            this.where = [
                {
                    type: 'enum',
                    name: 'type',
                    value: this.currentTab
                }
            ];
        },

        afterRender: function () {
            var link = 'memos';

            var url = this.model.name + '/' + this.model.id + '/' + link;

            if (!this.getAcl().check('Memo', 'read')) {
                this.$el.find('.list-container').html(this.translate('No Access'));
                this.$el.find('.button-container').remove();
                return;
            };

            this.getCollectionFactory().create('Memo', function (collection) {
                this.collection = collection;
                collection.seeds = this.seeds;
                collection.url = url;
                collection.where = this.where;
                collection.sortBy = this.sortBy;
                collection.asc = this.asc;
                collection.maxSize = this.getConfig().get('recordsPerPageSmall') || 5;

                var rowActionsView = 'crm:views/record/row-actions/memos';

                this.listenToOnce(this.collection, 'sync', function () {
                    this.createView('list', 'views/record/list-expanded', {
                        el: this.getSelector() + ' > .list-container',
                        pagination: false,
                        type: 'listSmall',
                        rowActionsView: rowActionsView,
                        checkboxes: false,
                        collection: collection,
                        listLayout: this.listLayout,
                    }, function (view) {
                        view.render();
                    });
                }.bind(this));
                this.collection.fetch();
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
        },

        actionRefresh: function () {
            this.collection.fetch();
        },

        actionComplete: function (data) {
            var id = data.id;
            if (!id) {
                return;
            }
            var model = this.collection.get(id);
            model.save({
                status: 'Completed'
            }, {
                patch: true,
                success: function () {
                    this.collection.fetch();
                }.bind(this)
            });
        },

    });
});

