
<!--<ul class="pagination pagination-sm">
    <li {{#unless previous}}class="disabled"{{/unless}}>
        <a href="javascript:" data-page="first"> <i class="glyphicon glyphicon-fast-backward"></i> </a> 
    </li>
    <li {{#unless previous}}class="disabled"{{/unless}}>
        <a href="javascript:" data-page="previous"> <i class="glyphicon glyphicon-backward"></i> </a> 
    </li>
    <li>
        <a href="javascript:" data-page="current"> {{from}} - {{to}} {{translate 'of'}} {{total}} </a>
    </li>
    <li {{#unless next}}class="disabled"{{/unless}}>
        <a href="javascript:" data-page="next"> <i class="glyphicon glyphicon-forward"></i> </a> 
    </li>
    <li {{#unless next}}class="disabled"{{/unless}}>
        <a href="javascript:" data-page="last"> <i class="glyphicon glyphicon-fast-forward"></i> </a>
    </li>
</ul>-->
<div class="btn-toolbar" role="toolbar" aria-label="...">
    <ul class="pagination pagination-sm btn-group" role="group">
        
        
        <li {{#unless previous}}class="disabled"{{/unless}}>
            <a href="javascript:" data-page="first"> <i class="fa fa-angle-double-left"></i> </a> 
        </li>
        <li {{#unless previous}}class="disabled"{{/unless}}>
            <a href="javascript:" data-page="previous"> <i class="fa fa-angle-left"></i> </a> 
        </li>
        
        <li>
            <a href="javascript:" data-page="current"> {{from}} - {{to}} {{translate 'of'}} {{total}} </a>
        </li>
        
        <li>
            <select class="btn btn-sm">
                {{#each sizingArray}}
                    <option value="{{this}}" {{#ifEqual this ../maxSize}}selected{{/ifEqual}}>{{this}} {{translate 'per page'}}</option>
                {{/each}}

            </select>
        </li>
        
        <li {{#unless next}}class="disabled"{{/unless}}>
            <a href="javascript:" data-page="next"> <i class="fa fa-angle-right"></i> </a> 
        </li>
        <li {{#unless next}}class="disabled"{{/unless}}>
            <a href="javascript:" data-page="last"> <i class="fa fa-angle-double-right"></i> </a>
        </li>
    </ul>
</div>


