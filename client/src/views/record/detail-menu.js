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
Espo.define('views/record/detail-menu', 'view', function (Dep) {

    return Dep.extend({
        
        template: 'record/menu',
        
        mode: 'detail',
        
        readOnly: false,
        
        panelList: [],
        
        subPanelList: [/*{
            "name":"memo",
            "label":"Memo",
            "view":"crm:views/record/panels/memos",
            "sticked": false
        },*/{
            "name":"stream",
            "label":"Stream",
            "view":"views/stream/panel",
            "sticked": false
        }],
        
        hasSide: false,
        
        sidebarEnabledList: ['Meeting','Call'],
        
        activePanel: null,

        events: {
        },

        init: function () {
            this.panelList = this.options.panelList || this.panelList;
            this.subPanelList = this.options.subPanelList || this.subPanelList;
            this.mode = this.options.mode || this.mode;
            this.type = this.options.type || this.type;
            
            this.activePanel = this.options.activePanel || this.activePanel;
            
            this.subPanelList = Espo.Utils.clone(this.subPanelList);
            
            this.scope = this.options.model.name;
            this.recordHelper = this.options.recordHelper;
            
            console.log("MENU",this.activePanel,this.scope,this.type + 'Menu' + this.scope,this.panelList,this.getStorage());
        },
        
        data: function () {
            return {
                panelList: this.panelList,
                subPanelList: this.subPanelList,
                activePanel: this.activePanel,
                scope: this.scope,
            };
        },
        
        saveStored: function() {
            this.getStorage().set(this.type + 'Menu' + this.scope, 'activePanel', this.activePanel);
        },
        
        setupMenu: function () {
        },

        setup: function () {
            var scope = this.scope;

            this.setupMenu();
            
            var subPanelList = [];
            
            
            
            if (this.type != 'detailSmall') {
                var additionalPanels = this.getMetadata().get('clientDefs.' + this.scope + '.sidePanels.' + this.type) || [];
                additionalPanels.forEach(function (panel) {
                    subPanelList.push(panel);
                }, this);

                this.subPanelList = subPanelList.concat(this.subPanelList);

                this.subPanelList = this.subPanelList.filter(function (p) {
                    if (p.aclScope) {
                        if (!this.getAcl().checkScope(p.aclScope)) {
                            return;
                        } 
                    }
                    console.log("SUBPANEL LIST",p.name,this.getMetadata().get('scopes.' + scope + '.memo'));

                    if (p.name === 'stream' && this.mode != 'edit') {
                        if (this.getMetadata().get('scopes.' + scope + '.stream')) {
                            var streamAllowed = this.getAcl().checkModel(this.model, 'stream', true);
                            if (streamAllowed === null)
                                return;
                        }
                        else
                            return;
                    }
                    else if (p.name === 'memo' && this.mode != 'edit') {
                        if (this.getMetadata().get('scopes.' + scope + '.memo')) {
                            var memoAllowed = this.getAcl().checkModel(this.model, 'memo', true);
                            if (memoAllowed === null)
                                return;
                        }
                        else
                            return;
                    }
                    
                    return true;
                }, this);

                this.subPanelList = this.subPanelList.map(function (p) {
                    var item = Espo.Utils.clone(p);
                    var item = {
                        label: p.label,
                        model: this.model,
                        name: Espo.Utils.composeCssName(p.name),
                        shortName: 'tabpanel-' + Espo.Utils.composeCssName(scope) + '-' + Espo.Utils.composeCssName(p.name),
                        recordHelper: this.recordHelper,
                        defs: item
                    };
                    return item;
                }, this);

                console.log("DETAIL MENU SETUP",this.subPanelList);
            }
            else {
                this.subPanelList = [];
            }
            
            var hasSide = this.getMetadata().get('clientDefs.' + this.scope + '.hasSide') || false;
            
            if (hasSide == true || this.sidebarEnabledList.indexOf(this.model.name) != -1) {
                this.hasSide = true;
                this.subPanelList = [];
            }
            
            this.setupMenuView();
        },

        setupMenuView: function () {
        },

        showPanel: function (name) {
            console.log("SHOWPANEL",name);
        },

        hidePanel: function (name) {
            console.log("HIDEPANEL",name);
        },
        
        afterRender: function() {
            var selector = this.getSelector();
            selector = selector.replace(/\.menu/g,"");
            var me = this;
            $(selector + ' .record-menu a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var $target = $(e.currentTarget);
                var active = $target.data('panel');
                console.log($target,active);
                this.activePanel = active;
                this.saveStored(); 
            }.bind(this));
        }

    });

});

