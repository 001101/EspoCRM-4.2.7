<div class="panel-body body">
	<form id="nav">
		<div class="row">
			<div class=" col-md-13">
				<div class="panel-body" align="center" height="50px">
					<div class="message">
						{$langs['labels']['Congratulation! Welcome to EspoCRM']}
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
<div style="text-align: center;"><img style="width: 60%;" alt="pluscrm"
 src="img/logo_text.png"><br>
</div>

{if $cronHelp}
<div class="cron-help">
	&nbsp;{$cronTitle}
	<pre>
	{$cronHelp}
	</pre>
</div>
{/if}
<footer class="modal-footer">
	<button class="btn btn-primary" type="button" id="start">{$langs['labels']['Go to EspoCRM']}</button>
</footer>
<script>
	{literal}
	$(function(){
	{/literal}
		var langs = {$langsJs};
	{literal}
		var installScript = new InstallScript({action: 'finish', langs: langs});
	})
	{/literal}
</script>