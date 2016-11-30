{{#if actionList.length}}
<div class="list-icon-buttons {{#if basedOnRelation}}list-icon-related-buttons{{/if}}">
    {{#each actionList}}
    <a {{#if link}}href="{{link}}"{{else}}href="javascript:"{{/if}} class="action {{#if class}}{{class}}{{/if}}" {{#if action}} data-action={{action}}{{/if}}{{#each data}} data-{{@key}}="{{./this}}"{{/each}}>{{#if html}}{{{html}}}{{else}}{{#if icon}}<span class="{{icon}}" aria-hidden="true" title="{{translate label scope=../../scope}}"></span>{{else}}{{translate label scope=../../scope}}{{/if}}{{/if}}</a></li>
    {{/each}}
</div>
{{/if}}



