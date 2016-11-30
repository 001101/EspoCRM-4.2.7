<?php
return [
    'cacheTimestamp' => 1480508970,
    'database' => [
        'driver' => 'pdo_mysql',
        'dbname' => 'sh_db',
        'user' => 'root',
        'password' => '',
        'port' => '',
        'host' => 'localhost'
    ],
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
    'currencyList' => [
        0 => 'EUR'
    ],
    'defaultCurrency' => 'EUR',
    'baseCurrency' => 'EUR',
    'currencyRates' => [
        
    ],
    'outboundEmailIsShared' => false,
    'outboundEmailFromName' => '',
    'outboundEmailFromAddress' => '',
    'smtpServer' => '',
    'smtpPort' => '25',
    'smtpAuth' => false,
    'smtpSecurity' => '',
    'smtpUsername' => 'admin',
    'smtpPassword' => 'pass',
    'languageList' => [
        0 => 'de_DE',
        1 => 'en_US'
    ],
    'language' => 'en_US',
    'logger' => [
        'path' => 'data/logs/plus.log',
        'level' => 'WARNING',
        'rotation' => true,
        'maxFileNumber' => 30
    ],
    'authenticationMethod' => 'Espo',
    'globalSearchEntityList' => [
        0 => 'Account',
        1 => 'Contact',
        2 => 'Lead',
        3 => 'Opportunity'
    ],
    'tabList' => [
        0 => 'Account',
        1 => 'Contact',
        2 => 'Memo',
        3 => 'Opportunity',
        4 => 'Case',
        5 => 'Lead',
        6 => 'TargetList',
        7 => 'Meeting',
        8 => 'Call',
        9 => 'Task',
        10 => 'Calendar',
        11 => 'Email',
        12 => 'Document',
        13 => 'Campaign',
        14 => 'KnowledgeBaseArticle',
        15 => 'User',
        16 => 'EmailTemplate',
        17 => 'Project'
    ],
    'quickCreateList' => [
        0 => 'Account',
        1 => 'Contact',
        2 => 'Memo',
        3 => 'Meeting',
        4 => 'Call',
        5 => 'Lead',
        6 => 'Opportunity',
        7 => 'Task',
        8 => 'Case',
        9 => 'Email'
    ],
    'exportDisabled' => false,
    'assignmentEmailNotifications' => false,
    'assignmentEmailNotificationsEntityList' => [
        0 => 'Lead',
        1 => 'Opportunity',
        2 => 'Task',
        3 => 'Case'
    ],
    'assignmentNotificationsEntityList' => [
        0 => 'Meeting',
        1 => 'Call',
        2 => 'Task',
        3 => 'Email'
    ],
    'portalStreamEmailNotifications' => true,
    'streamEmailNotificationsEntityList' => [
        0 => 'Case'
    ],
    'emailMessageMaxSize' => 10,
    'notificationsCheckInterval' => 10,
    'disabledCountQueryEntityList' => [
        
    ],
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
    'userNameRegularExpression' => '[^a-z0-9\\-@_\\.\\s]',
    'addressFormat' => 2,
    'displayListViewRecordCount' => true,
    'dashboardLayout' => [
        0 => (object) [
            'name' => 'My Plus',
            'layout' => [
                0 => (object) [
                    'id' => 'default-activities',
                    'name' => 'Activities',
                    'x' => 2,
                    'y' => 2,
                    'width' => 2,
                    'height' => 2
                ],
                1 => (object) [
                    'id' => 'd59076',
                    'name' => 'Memos',
                    'x' => 0,
                    'y' => 0,
                    'width' => 2,
                    'height' => 4
                ],
                2 => (object) [
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
    'calendarEntityList' => [
        0 => 'Meeting',
        1 => 'Call',
        2 => 'Task'
    ],
    'isInstalled' => true,
    'siteUrl' => 'http://espo.sh',
    'passwordSalt' => 'c5a7a51fd2b8f297'
];
?>