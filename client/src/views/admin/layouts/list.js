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

Espo.define('views/admin/layouts/list', 'views/admin/layouts/rows', function (Dep) {

    return Dep.extend({
        
        tableAttributes: ['scrollTable'],
        
        tableAttributesDefs: {
            scrollTable: {type: 'bool'}
        },
        
        listDefinitions: {},

        dataAttributes: ['name', 'width', 'link', 'notSortable', 'align'],

        dataAttributesDefs: {
            link: {type: 'bool'},
            width: {type: 'float'},
            notSortable: {type: 'bool'},
            align: {
                type: 'enum',
                options: ["left", "right"]
            }
        },

        editable: true,

        ignoreList: [],

        ignoreTypeList: [],
        
        buttonList: [
            {
                name: 'save',
                label: 'Save',
                style: 'primary',
            },
            {
                name: 'cancel',
                label: 'Cancel',
            },
            {
                name: 'resetToDefault',
                label: 'Reset to Default',
            }
        ],
        
        events: _.extend({
            'click button[data-action="settings"]': function (e) {
                var data = {};
                this.tableAttributes.forEach(function (attr) {
                    data[attr] =  $("#layout").data(Espo.Utils.toDom(attr))
                });
                console.log("READ IN DATA",data)
                this.openSettingsDialog(data);
            },
        }, Dep.prototype.events),

        setup: function () {
            Dep.prototype.setup.call(this);

            this.wait(true);
            this.loadLayout(function () {
                this.wait(false);
            }.bind(this));

            this.events
        },

        loadLayout: function (callback) {
            
            if (this.type == 'list') {
                this.buttonList = [
                    {
                        name: 'save',
                        label: 'Save',
                        style: 'primary',
                    },
                    {
                        name: 'cancel',
                        label: 'Cancel',
                    },
                    {
                        name: 'settings',
                        label: 'Settings',
                    },
                    {
                        name: 'resetToDefault',
                        label: 'Reset to Default',
                    }
                ];
            }
            
            this.getModelFactory().create(Espo.Utils.hyphenToUpperCamelCase(this.scope), function (model) {
                this.getHelper().layoutManager.get(this.scope, this.type, function (layout) {
                    if (this.type === 'list') {
                        this.getHelper().layoutManager.get(this.scope, this.type+'Definitions', function (layoutDefitions) {
                            this.listDefinitions = layoutDefitions;
                            this.readDataFromLayout(model, layout);
                            if (callback) {
                                callback();
                            }
                        }.bind(this), false);
                    }
                    else {
                        this.readDataFromLayout(model, layout);
                        if (callback) {
                            callback();
                        }
                    }
                }.bind(this), false);
            }.bind(this));
        },

        readDataFromLayout: function (model, layout) {
            var allFields = [];
            for (var field in model.defs.fields) {
                if (this.checkFieldType(model.getFieldParam(field, 'type')) && this.isFieldEnabled(model, field)) {

                    allFields.push(field);
                }
            }

            allFields.sort(function (v1, v2) {
                return this.translate(v1, 'fields', this.scope).localeCompare(this.translate(v2, 'fields', this.scope));
            }.bind(this));

            this.enabledFieldsList = [];

            this.enabledFields = [];
            this.disabledFields = [];

            for (var i in layout) {
                this.enabledFields.push({
                    name: layout[i].name,
                    label: this.getLanguage().translate(layout[i].name, 'fields', this.scope)
                });
                this.enabledFieldsList.push(layout[i].name);
            }

            for (var i in allFields) {
                if (!_.contains(this.enabledFieldsList, allFields[i])) {
                    this.disabledFields.push({
                        name: allFields[i],
                        label: this.getLanguage().translate(allFields[i], 'fields', this.scope)
                    });
                }
            }

            this.rowLayout = layout;

            for (var i in this.rowLayout) {
                this.rowLayout[i].label = this.getLanguage().translate(this.rowLayout[i].name, 'fields', this.scope);
            }
            
            console.log("ROW LAYXP",this.rowLayout);
        },

        parseDataAttributes: function (dialog) {
            var width = parseFloat(dialog.$el.find("[name='width']").val());
            if (isNaN(width) || width > 100 || width < 0) {
                width = '';
            }
            return {
                width: width,
                link: dialog.$el.find("[name='link']").val()
            };
        },

        checkFieldType: function (type) {
            if (['linkMultiple'].indexOf(type) != -1) {
                return false;
            }
            return true;
        },

        isFieldEnabled: function (model, name) {
            if (this.ignoreList.indexOf(name) != -1) {
                return false;
            }
            if (this.ignoreTypeList.indexOf(model.getFieldParam(name, 'type')) != -1) {
                return false;
            }
            return !model.getFieldParam(name, 'disabled') && !model.getFieldParam(name, 'layoutListDisabled');
        },
        
        openSettingsDialog: function (attributes) {
            this.createView('settingsModal', 'Admin.Layouts.Modals.EditAttributes', {
                name: this.getLanguage().translate('Settings', null, this.scope),
                scope: this.scope,
                attributeList: this.tableAttributes,
                attributeDefs: this.tableAttributesDefs,
                attributes: attributes
            }, function (view) {
                view.render();
                this.listenToOnce(view, 'after:save', function (attributes) {
                    var $li = $("#layout");
                    for (var key in attributes) {
                        $li.attr('data-' + key, attributes[key]);
                        $li.data(key, attributes[key]);
                        $li.find('.' + key + '-value').text(attributes[key]);
                    }
                    view.close();
                }, this);
            }.bind(this));
        },

        fetchSettings: function() {
            var def = {};
            this.tableAttributes.forEach(function (attr) {
                var value = $('#layout').data(Espo.Utils.toDom(attr)) || null;
                if (value) {
                    def[attr] = value;
                }
            });
            console.log("FETCHED SERR",def);
            return def;
        }
    });
});


