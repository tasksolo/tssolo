go := env_var_or_default('GOCMD', 'go')

default: build

build:
	tsc

todo:
	-git grep -e TODO --and --not -e ignoretodo | grep -v client.js.map

update-client: && default
	curl --silent --output client.ts 'https://a45ad4e2.api.solotask.io/v1/_client.ts'
