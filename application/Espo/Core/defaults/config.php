<?php
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

return array (
    'database' => array (
        'driver' => 'pdo_mysql',
        'host' => 'localhost',
        'port' => '',
        'charset' => 'utf8',
        'dbname' => '',
        'user' => '',
        'password' => '',
    ),
    'useCache' => true,
    'recordsPerPage' => 50,
    'recordsPerPageSmall' => 10,
    'applicationName' => 'pluscrm',
    'version' => '4.2.5b',
    'timeZone' => 'Europe/Berlin',
    'dateFormat' => 'DD.MM.YYYY',
    'timeFormat' => 'HH:mm',
    'weekStart' => 1,
    'thousandSeparator' => '.',
    'decimalMark' => ',',
    'exportDelimiter' => ';',
    'currencyList' => ['EUR'],
    'defaultCurrency' => 'EUR',
    'baseCurrency' => 'EUR',
    'currencyRates' => [],
    'outboundEmailIsShared' => true,
    'outboundEmailFromName' => 'pluscrm',
    'outboundEmailFromAddress' => '',
    'smtpServer' => '',
    'smtpPort' => 25,
    'smtpAuth' => true,
    'smtpSecurity' => '',
    'smtpUsername' => '',
    'smtpPassword' => '',
    'languageList' => [
        'de_DE',
        'en_US'
    ],
    'language' => 'de_DE',
    'logger' =>
    array (
        'path' => 'data/logs/plus.log',
        'level' => 'WARNING', /** DEBUG, INFO, NOTICE, WARNING, ERROR, CRITICAL, ALERT, EMERGENCY */
        'rotation' => true,
        'maxFileNumber' => 30,
    ),
    'authenticationMethod' => 'Espo',
    'globalSearchEntityList' =>
    array (
        'Account',
        'Contact',
        'Lead',
        'Opportunity',
    ),
    "tabList" => ["Account", "Contact", "Memo", "Opportunity", "Case", "Lead", "TargetList", "Meeting", "Call", "Task", "Calendar", "Email", "Document", "Campaign", "KnowledgeBaseArticle", "User", "EmailTemplate"],
    "quickCreateList" => ["Account", "Contact", "Memo", "Meeting", "Call", "Lead", "Opportunity", "Task", "Case", "Email"],
    'exportDisabled' => false,
    'assignmentEmailNotifications' => false,
    'assignmentEmailNotificationsEntityList' => ['Lead', 'Opportunity', 'Task', 'Case'],
    'assignmentNotificationsEntityList' => ['Meeting', 'Call', 'Task', 'Email'],
    "portalStreamEmailNotifications" => true,
    'streamEmailNotificationsEntityList' => ['Case'],
    'emailMessageMaxSize' => 10,
    'notificationsCheckInterval' => 10,
    'disabledCountQueryEntityList' => [],
    'maxEmailAccountCount' => 2,
    'followCreatedEntities' => false,
    'b2cMode' => false,
    'restrictedMode' => false,
    'theme' => 'Pluscrm',
    'massEmailMaxPerHourCount' => 100,
    'personalEmailMaxPortionSize' => 10,
    'inboundEmailMaxPortionSize' => 20,
    'authTokenLifetime' => 0,
    'authTokenMaxIdleTime' => 120,
    'userNameRegularExpression' => '[^a-z0-9\-@_\.\s]',
    'addressFormat' => 2,
    'displayListViewRecordCount' => true,
    'dashboardLayout' => [
        (object) [
            'name' => 'My Plus',
            'layout' => [
                (object) [
                    'id' => 'default-activities',
                    'name' => 'Activities',
                    'x' => 2,
                    'y' => 2,
                    'width' => 2,
                    'height' => 2
                ],
                (object) [
                    'id' => 'd59076',
                    'name' => 'Memos',
                    'x' => 0,
                    'y' => 0,
                    'width' => 2,
                    'height' => 4
                ],
                (object) [
                    'id' => 'default-tasks',
                    'name' => 'Tasks',
                    'x' => 2,
                    'y' => 0,
                    'width' => 2,
                    'height' => 2
                ]
            ]
        ]
    ],
    "calendarEntityList" => ["Meeting", "Call", "Task"],
    'isInstalled' => false,
);

