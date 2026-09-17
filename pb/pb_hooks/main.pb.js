/// <reference path="../pb_data/types.d.ts" />

onRecordCreateRequest((e) => {
	e.next();
	e.record.set('verified', true);
	$app.save(e.record);
}, 'users');
