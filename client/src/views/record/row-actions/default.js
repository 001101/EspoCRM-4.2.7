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

Espo.define('views/record/row-actions/default', 'view', function (Dep) {

    return Dep.extend({

        template: 'record/row-actions/default',
        
        isDropdown: true,
        
        basedOnRelation: false,
        
        follow: true,
        
        isIconList: false,
        
        type: 'list',

        setup: function () {
            this.options.acl = this.options.acl || {};
            this.options.isDropdown = this.options.isDropdown || this.isDropdown;
            this.follow = _.isUndefined(this.options.follow) ? this.follow : this.options.follow;
            this.type = _.isUndefined(this.options.type) ? this.type : this.options.type;
            this.basedOnRelation = _.isUndefined(this.options.basedOnRelation) ? this.basedOnRelation : this.options.basedOnRelation;
            this.isIconList = _.isUndefined(this.options.isIconList) ? this.isIconList : this.options.isIconList;
            
            if (this.isIconList) {
                this.template = 'record/row-actions/icons';
            }
        },

        afterRender: function () {
            if (!this.isIconList) {
                var $dd = this.$el.find('button[data-toggle="dropdown"]').parent();

                var isChecked = false;
                $dd.on('show.bs.dropdown', function () {
                    var $el = this.$el.closest('.list-row');
                    isChecked = false;
                    if ($el.hasClass('active')) {
                        isChecked = true;
                    }
                    $el.addClass('active');
                }.bind(this));
                $dd.on('hide.bs.dropdown', function () {
                    if (!isChecked) {
                        this.$el.closest('.list-row').removeClass('active');
                    }
                }.bind(this));
            }
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
            if (this.follow) {
                var icon = 'star',
                    follow = false;
                if (this.model.has('isFollowed') && this.model.get('isFollowed') === true) {
                    icon += ' filled';
                    follow = true;
                }
                
                list = list.concat([{
                    action: 'listfollow',
                    label: 'Follow',
                    class: 'followstar',
                    icon: icon,
                    data: {
                        id: this.model.id,
                        follow: follow
                    }
                }]);
            }
            if (this.options.acl.edit) {
                list = list.concat([
                    {
                        action: 'quickEdit',
                        label: 'Edit',
                        icon: 'glyphicon glyphicon-pencil',
                        data: {
                            id: this.model.id
                        }
                    },
                    /*{
                        action: 'quickRemove',
                        label: 'Remove',
                        icon: 'glyphicon glyphicon-remove',
                        data: {
                            id: this.model.id
                        }
                    }*/
                ]);
            }
            return list;
        },

        data: function () {
            return {
                acl: this.options.acl,
                actionList: this.getActionList(),
                scope: this.model.name,
                isDropdown: this.isDropdown,
                follow: this.follow,
                basedOnRelation: this.basedOnRelation
            };
        }
    });

});


