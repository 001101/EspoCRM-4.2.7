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

Espo.define('views/fields/varchar', 'views/fields/base', function (Dep) {

    return Dep.extend({

        type: 'varchar',

        searchTemplate: 'fields/varchar/search',

        setupSearch: function () {
            this.searchParams.typeOptions = ['startsWith', 'endsWith', 'contains', 'equals', 'like', 'isEmpty', 'isNotEmpty'];
            this.events = _.extend({
                'change select.search-type': function (e) {
                    var type = $(e.currentTarget).val();
                    this.handleSearchType(type);
                },
            }, this.events || {});
        },

        handleSearchType: function (type) {
            if (~['isEmpty', 'isNotEmpty'].indexOf(type)) {
                this.$el.find('input.main-element').addClass('hidden');
            } else {
                this.$el.find('input.main-element').removeClass('hidden');
            }
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            if (this.mode == 'search') {
                var type = this.$el.find('select.search-type').val();
                this.handleSearchType(type);
            }
        },

        fetch: function () {
            var data = {};
            var value = this.$element.val();
            if (this.params.trim) {
                if (typeof value.trim === 'function') {
                    value = value.trim();
                }
            }
            data[this.name] = value;
            return data;
        },

        fetchSearch: function () {

            var type = this.$el.find('[name="'+this.name+'-type"]').val() || 'startsWith';

            var data;

            if (~['isEmpty', 'isNotEmpty'].indexOf(type)) {
                if (type == 'isEmpty') {
                    data = {
                        typeFront: type,
                        where: {
                            type: 'or',
                            value: [
                                {
                                    type: 'isNull',
                                    field: this.name,
                                },
                                {
                                    type: 'equals',
                                    field: this.name,
                                    value: ''
                                }
                            ]
                        }
                    }
                } else {
                    data = {
                        typeFront: type,
                        where: {
                            type: 'and',
                            value: [
                                {
                                    type: 'notEquals',
                                    field: this.name,
                                    value: ''
                                },
                                {
                                    type: 'isNotNull',
                                    field: this.name,
                                    value: null
                                }
                            ]
                        }
                    }
                }
                return data;
            } else {
                var value = this.$element.val().toString().trim();
                value = value.trim();
                if (value) {
                    data = {
                        value: value,
                        type: type,
                        typeFront: type
                    }
                    return data;
                }
            }
            return false;
        }

    });
});

