<ul class="nav nav-tabs record-menu" role="tablist">
{{#each panelList}}
    {{#if label}} 
        <li role="presentation" class="{{#if ../../activePanel}}{{#ifEqual ../../../activePanel name}}active{{/ifEqual}}{{else}}{{#if @first}}active{{/if}}{{/if}}"><a href="#{{shortName}}" aria-controls="{{shortName}}" data-panel="{{name}}" role="tab" data-toggle="tab">{{translate label scope=model.name}}</a></li>
    {{/if}}  
{{/each}}
{{#each subPanelList}}
    <li role="presentation" {{#ifEqual ../activePanel name}}class="active"{{/ifEqual}}><a href="#{{shortName}}" aria-controls="{{shortName}}" data-panel="{{name}}" role="tab" data-toggle="tab">{{translate label scope=model.name}}</a></li>
{{/each}}
</ul>
