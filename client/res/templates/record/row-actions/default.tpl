{{#if actionList.length}}
<div class="list-row-buttons btn-group pull-right">
    {{#if isDropdown}}<button type="button" class="btn btn-link btn-sm dropdown-toggle" data-toggle="dropdown">
        <span class="caret"></span>
    </button>{{/if}}
    <ul class="{{#if isDropdown}}dropdown-menu{{else}}icon-action-buttons{{/if}} pull-right">   
    {{#each actionList}}
        {{#if ../isDropdown}}<li>{{/if}}
            <a {{#if link}}href="{{link}}"{{else}}href="javascript:"{{/if}} class="action" {{#if action}} data-action={{action}}{{/if}}{{#each data}} data-{{@key}}="{{./this}}"{{/each}} {{#if title}}title="{{title}}"{{/if}}>{{#if html}}{{{html}}}{{else}}{{translate label scope=../../scope}}{{/if}}</a>
        {{#if ../isDropdown}}</li>{{/if}}
    {{/each}}
    </ul>
</div>
{{/if}}



