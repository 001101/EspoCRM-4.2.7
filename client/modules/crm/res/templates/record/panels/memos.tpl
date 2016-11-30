<div class="btn-group button-container">
    {{#each tabList}}
        <button class="btn btn-default all{{#ifEqual ../currentTab this}} active{{/ifEqual}} tab-switcher" data-tab="{{./this}}">{{translateOption this scope='Memo' field='type'}}</button>
    {{/each}}
</div>

<div class="list-container">
    {{{list}}}
</div>

