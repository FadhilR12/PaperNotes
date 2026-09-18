./pocketbase superuser upsert ${SUPERUSER_EMAIL:?SUPERUSER_EMAIL is required} ${SUPERUSER_PASS:?SUPERUSER_PASS is required}
./pocketbase migrate up

if [ "${SEED_DATA:-false}" = "true" ]; then
	./pocketbase seed
fi

./pocketbase serve --http=0.0.0.0:${PORT:?PORT is required}