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

namespace Espo\Modules\Crm\Services;

use \Espo\ORM\Entity;
use \Espo\Core\Exceptions\Error;
use \Espo\Core\Exceptions\Forbidden;
use \Espo\Core\Exceptions\BadRequest;
use \Espo\Core\Exceptions\Conflict;
use \Espo\Core\Exceptions\NotFound;

ini_set("display_errors",1);
class Account extends \Espo\Services\Record
{
    protected $linkSelectParams = array(
        'contacts' => array(
            'additionalColumns' => array(
                'role' => 'accountRole'
            )
        )
    );

    protected function getDuplicateWhereClause(Entity $entity, $data = array())
    {
        return array(
            'name' => $entity->get('name')
        );
    }
    
    protected function findLinkedEntitiesMemos($id, $params)
    {
        $link = 'memos';

        $entity = $this->getEntityManager()->getEntity('Account', $id);
        
        $foreignEntityName = $entity->relations[$link]['entity'];

        if (!$this->getAcl()->check($foreignEntityName, 'read')) {
            throw new Forbidden();
        }

        $disableCount = false;
        if (in_array($foreignEntityName, $this->getConfig()->get('disabledCountQueryEntityList', array()))) {
            $disableCount = true;
        }

        $maxSize = 0;
        if ($disableCount) {
            if (!empty($params['maxSize'])) {
                $maxSize = $params['maxSize'];
                $params['maxSize'] = $params['maxSize'] + 1;
            }
        }

        $selectParams = $this->getSelectManager($foreignEntityName)->getSelectParams($params, true);

        $selectParams['whereClause'][] = array(
            'OR' => array(
                array(
                    'parentId' => $id,
                    'parentType' => 'Account'
                ),
                array(
                    'accountId' => $id
                )
            )
        );
        $selectParams['removeWhereFields'] = array('parentId','parentType');
        //$selectParams['customWhere'] = " OR memo.account_id = '{$id}' AND memo.deleted = '0'";


        if (array_key_exists($link, $this->linkSelectParams)) {
            $selectParams = array_merge($selectParams, $this->linkSelectParams[$link]);
        }

        $collection = $this->getRepository()->findRelated($entity, $link, $selectParams);

        $recordService = $this->getRecordService($foreignEntityName);

        foreach ($collection as $e) {
            $recordService->loadAdditionalFieldsForList($e);
            $recordService->prepareEntityForOutput($e);
        }

        if (!$disableCount) {
            $total = $this->getRepository()->countRelated($entity, $link, $selectParams);
        } else {
            if ($maxSize && count($collection) > $maxSize) {
                $total = -1;
                unset($collection[count($collection) - 1]);
            } else {
                $total = -2;
            }
        }
        //die("xx");
    

        return array(
            'total' => $total,
            'collection' => $collection
        );
    }
}

