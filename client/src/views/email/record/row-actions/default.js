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

Espo.define('views/email/record/row-actions/default', 'views/record/row-actions/default', function (Dep) {

    return Dep.extend({

        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:isImportant', function () {
                setTimeout(function () {
                    this.reRender();
                }.bind(this), 10);
            }, this);
        },

        getActionList: function () {
            var list = [{
                action: 'quickView',
                label: 'View',
                icon: 'glyphicon glyphicon-eye-open',
                data: {
                    id: this.model.id
                }
            }];
            /*if (this.options.acl.edit) {
                list = list.concat([
                    {
                        action: 'quickEdit',
                        label: 'Edit',
                        icon: 'glyphicon glyphicon-pencil',
                        data: {
                            id: this.model.id
                        }
                    }
                ]);
            }*/
            if (this.model.get('isUsers') && this.model.get('status') !== 'Draft') {
                if (!this.model.get('inTrash')) {
                    list.push({
                        action: 'moveToTrash',
                        label: 'Move to Trash',
                        icon: 'fa fa-trash',
                        data: {
                            id: this.model.id
                        }
                    });
                } else {
                    list.push({
                        action: 'retrieveFromTrash',
                        label: 'Retrieve from Trash',
                        icon: 'fa fa-recycle',
                        data: {
                            id: this.model.id
                        }
                    });
                }


            }
            /*if (this.getAcl().checkModel(this.model, 'delete')) {
                list.push({
                    action: 'quickRemove',
                    label: 'Remove',
                    icon: 'glyphicon glyphicon-remove',
                    data: {
                        id: this.model.id
                    }
                });
            }*/
            if (this.model.get('isUsers')) {
                if (!this.model.get('isImportant')) {
                    if (!this.model.get('inTrash')) {
                        list.push({
                            action: 'markAsImportant',
                            label: 'Mark as Important',
                            icon: 'fa fa-exclamation-circle',
                            data: {
                                id: this.model.id
                            }
                        });
                    }
                } else {
                    list.push({
                        action: 'markAsNotImportant',
                        label: 'Unmark Importance',
                        icon: 'fa fa-exclamation',
                        data: {
                            id: this.model.id
                        }
                    });
                }
            }
            if (this.model.get('isUsers') && this.model.get('status') !== 'Draft') {
                if (!this.model.get('inTrash')) {
                    list.push({
                        action: 'moveToFolder',
                        label: 'Move to Folder',
                        icon: 'fa fa-folder',
                        data: {
                            id: this.model.id
                        }
                    });
                }
            }
            return list;
        }

    });

});


