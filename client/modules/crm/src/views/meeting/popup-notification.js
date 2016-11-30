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

Espo.define('crm:views/meeting/popup-notification', 'views/popup-notification', function (Dep) {

    return Dep.extend({

        type: 'event',

        style: 'primary',

        template: 'crm:meeting/popup-notification',

        closeButton: true,

        setup: function () {
            this.wait(true);

            if (this.notificationData.entityType) {
                this.getModelFactory().create(this.notificationData.entityType, function (model) {

                    model.set('dateStart', this.notificationData.dateStart);

                    this.createView('dateStart', 'views/fields/datetime', {
                        model: model,
                        mode: 'detail',
                        el: this.options.el + ' .field[data-name="dateStart"]',
                        defs: {
                            name: 'dateStart'
                        },
                        readOnly: true
                    });

                    this.wait(false);
                }, this);
            }
        },

        data: function () {
            return _.extend({
                header: this.translate(this.notificationData.entityType, 'scopeNames')
            }, Dep.prototype.data.call(this));
        },

        onCancel: function () {
            $.ajax({
                url: 'Activities/action/removePopupNotification',
                type: 'POST',
                data: JSON.stringify({
                    id: this.notificationId
                })
            });
        },

    });
});

