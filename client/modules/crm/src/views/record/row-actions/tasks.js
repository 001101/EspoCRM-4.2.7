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

Espo.define('crm:views/record/row-actions/tasks', 'views/record/row-actions/relationship-no-unlink', function (Dep) {

    return Dep.extend({

        isDropdown: false,
        
        isIconList: false,
        
        getActionList: function () {
            var list = [{
                action: 'quickView',
                label: 'View',
                html: '<span class="glyphicon glyphicon-eye-open"></span>',
                title: this.translate('View', this.scope),
                data: {
                    id: this.model.id
                }
            }];
            if (this.options.acl.edit) {
                list.push({
                    action: 'quickEdit',
                    label: 'Edit',
                    html: '<span class="glyphicon glyphicon-pencil"></span>',
                    title: this.translate('Edit', this.scope),
                    data: {
                        id: this.model.id
                    }
                });

                if (!~['Completed', 'Canceled'].indexOf(this.model.get('status'))) {
                    list.push({
                        action: 'Complete',
                        title: this.translate('Complete', 'labels', 'Task'),
                        html: '<span class="glyphicon glyphicon-ok"></span>',
                        data: {
                            id: this.model.id
                        }
                    });
                }


                list.push({
                    action: 'removeRelated',
                    label: 'Remove',
                    html: '<span class="glyphicon glyphicon-remove"></span>',
                    title: this.translate('Remove', this.scope),
                    data: {
                        id: this.model.id
                    }
                });

            }
            return list;
        }

    });

});

