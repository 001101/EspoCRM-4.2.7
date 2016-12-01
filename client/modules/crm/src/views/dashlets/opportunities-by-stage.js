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

Espo.define('crm:views/dashlets/opportunities-by-stage', 'crm:views/dashlets/abstract/chart', function (Dep) {

    return Dep.extend({

        name: 'OpportunitiesByStage',

        setupDefaultOptions: function () {
            this.defaultOptions['dateFrom'] = this.defaultOptions['dateFrom'] || moment().format('YYYY') + '-01-01';
            this.defaultOptions['dateTo'] = this.defaultOptions['dateTo'] || moment().format('YYYY') + '-12-31';
        },

        url: function () {
            return 'Opportunity/action/reportByStage?dateFrom=' + this.getOption('dateFrom') + '&dateTo=' + this.getOption('dateTo');
        },

        prepareData: function (response) {
            var d = [];
            for (var label in response) {
                var value = response[label];
                d.push({
                    stage: label,
                    value: value
                });
            }

            this.stageList = [];

            var data = [];
            var i = 0;
            d.forEach(function (item) {
                var o = {
                    data: [[item.value, d.length - i]],
                    label: this.getLanguage().translateOption(item.stage, 'stage', 'Opportunity'),
                }
                if (item.stage == 'Closed Won') {
                    o.color = this.successColor;
                }
                data.push(o);
                this.stageList.push(this.getLanguage().translateOption(item.stage, 'stage', 'Opportunity'));
                i++;
            }, this);

            return data;
        },

        setup: function () {
            this.currency = this.getConfig().get('defaultCurrency');
            this.currencySymbol = '';
        },

        drow: function () {

            //console.log(this.chartData);
            
            var self = this;
            this.flotr.draw(this.$container.get(0), this.chartData, {
                colors: this.colors,
                shadowSize: false,
                bars: {
                    show: true,
                    horizontal: true,
                    shadowSize: 0,
                    lineWidth: 1,
                    fillOpacity: 1,
                    barWidth: 0.5,
                },
                grid: {
                    backgroundColor: this.backgroundColor,
                    horizontalLines: false,
                    outline: 'sw',
                    color: this.outlineColor
                },
                yaxis: {
                    min: 0,
                    showLabels: false,
                },
                xaxis: {
                    min: 0,
                    tickFormatter: function (value) {
                        if (value != 0) {
                            return self.formatNumber(value) + ' ' + self.currency;
                        }
                        return '';
                    },
                },
                mouse: {
                    track: true,
                    relative: true,
                    position: 's',
                    trackFormatter: function (obj) {
                        return self.formatNumber(obj.x) + ' ' + self.currency;
                    },
                },
                legend: {
                    show: true,
                    noColumns: 5,
                    container: this.$el.find('.legend-container'),
                    labelBoxMargin: 0
                },
            });
            /*
            
            
            this.nv.addGraph( function() {
                var chart = this.nv.models.lineChart()
                .x(function(d) { return d.label })
                .y(function(d) { return d.value })
                .showLabels(true)     //Display pie labels
                .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
                .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
                ;

                this.d3.select(".chart-container svg")
                .datum(this.chartData)
                .transition().duration(350)
                .call(chart);

                return chart;
                }

            );
            
            
            */
        }, // end drow

    });
});


