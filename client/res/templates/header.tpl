<div class="row">
    <div class="col-lg-7 col-sm-7 col-xs-8">
        <h3>{{{header}}}</h3>
    </div>
    <div class="col-lg-5 col-sm-5 col-xs-4">
        <div class="header-buttons btn-group pull-right">
            {{#each items.buttons}}
                    <a {{#if link}}href="{{link}}"{{else}}href="javascript:"{{/if}} class="{{#if noBtn}}{{#if style}}{{style}}{{/if}}{{else}}btn btn-{{#if style}}{{style}}{{else}}default{{/if}}{{/if}} action{{#if hidden}} hidden{{/if}}" data-action="{{name}}"{{#each data}} data-{{@key}}="{{./this}}"{{/each}} {{#if title}}title="{{translate title scope=../../scope}}"{{/if}}>
                    {{#if iconHtml}}{{{iconHtml}}}{{/if}}
                    {{#if html}}{{{html}}}{{else}}{{translate label scope=../../scope}}{{/if}}
                    </a>
            {{/each}}

            {{#if items.actions}}
                <div class="btn-group" role="group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                    {{translate 'Actions'}} <span class="caret"></span>
                </button>
                <ul class="dropdown-menu pull-right">
                    {{#each items.actions}}
                    <li class="{{#if hidden}}hidden{{/if}}"><a {{#if link}}href="{{link}}"{{else}}href="javascript:"{{/if}} class="action" data-action="{{name}}"{{#each data}} data-{{@key}}="{{./this}}"{{/each}}>{{#if html}}{{{html}}}{{else}}{{translate label scope=../../../scope}}{{/if}}</a></li>
                    {{/each}}
                </ul>
                </div>
            {{/if}}

            {{#if items.dropdown}}
                <div class="btn-group" role="group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu pull-right">
                    {{#each items.dropdown}}
                    <li class="{{#if hidden}}hidden{{/if}}"><a {{#if link}}href="{{link}}"{{else}}href="javascript:"{{/if}} class="action" data-action="{{name}}"{{#each data}} data-{{@key}}="{{./this}}"{{/each}}>{{#if iconHtml}}{{{iconHtml}}} {{/if}}{{#if html}}{{{html}}}{{else}}{{translate label scope=../../../scope}}{{/if}}</a></li>
                    {{/each}}
                </ul>
                </div>
            {{/if}}
        </div>
    </div>
</div>

