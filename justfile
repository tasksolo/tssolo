go := env_var_or_default('GOCMD', 'go')

default: build

build:
	tsc

todo:
	-git grep -e TODO --and --not -e ignoretodo

update-client: && default
	curl --silent --output client.ts 'https://api.solø.com/v1/_client.ts'
