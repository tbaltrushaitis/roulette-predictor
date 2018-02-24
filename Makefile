##  ------------------------------------------------------------------------  ##
##                                Build Project                               ##
##  ------------------------------------------------------------------------  ##

# .SILENT:
.EXPORT_ALL_VARIABLES:
.IGNORE:
.ONESHELL:

##  ------------------------------------------------------------------------  ##

APP_NAME := roulette-predictor
APP_LOGO := ./assets/BANNER
APP_REPO := $(shell git ls-remote --get-url)
APP_ENV := $(shell cat ./NODE_ENV)

CODE_VERSION := $(shell cat ./VERSION)

WD := $(shell pwd -P)
DT = $(shell date +'%Y%m%d%H%M%S')


##  ------------------------------------------------------------------------  ##

DIR_SRC := src
DIR_BUILD := build-${CODE_VERSION}
DIR_DIST := dist-${CODE_VERSION}
DIR_WEB := webroot

APP_DIRS := $(addprefix ${WD}/,${DIR_BUILD} ${DIR_DIST} ${DIR_WEB})

##  ------------------------------------------------------------------------  ##
# Query the default goal.

ifeq ($(.DEFAULT_GOAL),)
.DEFAULT_GOAL := default
endif

##  ------------------------------------------------------------------------  ##
##                                  INCLUDES                                  ##
##  ------------------------------------------------------------------------  ##

include ./bin/.bash_colors
include ./bin/Makefile.*

##  ------------------------------------------------------------------------  ##

.PHONY: default

default: all;

##  ------------------------------------------------------------------------  ##

.PHONY: test

test: banner state help banner;

##  ------------------------------------------------------------------------  ##

.PHONY: banner

banner:
	@ if [ -f "${APP_LOGO}" ]; then cat "${APP_LOGO}"; fi

##  ------------------------------------------------------------------------  ##

.PHONY: clean clean-all
.PHONY: clean-src clean-deps
.PHONY: clean-build clean-dist clean-web clean-files

clean-all: clean clean-web clean-files

clean: clean-build clean-dist clean-files

clean-src:
	@ rm -rf ${DIR_SRC}

clean-build:
	@ rm -rf ${DIR_BUILD}

clean-dist:
	@ rm -rf ${DIR_DIST}

clean-web:
	@ rm -rf ${DIR_WEB}

clean-deps:
	@ rm -rf \
		bower_modules/ \
		node_modules/ ;

clean-files:
	@ rm -rf COMMIT \
		bitbucket-pipelines.yml \
		codeclimate-config.patch \
		_config.yml \
		_*.list ;

##  ------------------------------------------------------------------------  ##

.PHONY: rights

rights:
	@ find . -type f -exec chmod 664 {} 2>/dev/null \;
	@ find . -type d -exec chmod 775 {} 2>/dev/null \;
	@ find . -type f -name "*.sh" -exec chmod a+x {} 2>/dev/null \;

##  ------------------------------------------------------------------------  ##

.PHONY: setup build build-engine build-assets deploy finish-msg

setup:
	@ echo "APP_DIRS = [${APP_DIRS}]"
	$(foreach dir,${APP_DIRS},$(shell mkdir -p $(dir)))
	@ npm i
	@ bower i

build: build-engine build-assets;

build-engine:
	# @ ./setup.sh build

build-assets:
	@ gulp sync:bower2src
	@ gulp sync:src2build

# build:
	# @  cp -pr ${DIR_SRC}/* ${DIR_BUILD}/ 2>/dev/null ;

release:
	@ cp -rvuf ${DIR_BUILD}/* ${DIR_DIST}/ 2>/dev/null ;

deploy:
	@ cp -rvuf ${DIR_BUILD}/* ${DIR_WEB}/ 2>/dev/null ;
	@ rm -rf ${DIR_WEB}/resources 2>/dev/null ;
	@ cp -rvuf ./data/ ${DIR_WEB}/ 2>/dev/null ;

finish-msg:
	@ echo "PROCESS FINISHED" ;

##  ------------------------------------------------------------------------  ##

.PHONY: rebuild redeploy

rebuild: build;

redeploy: banner rebuild deploy finish-msg;

##  ------------------------------------------------------------------------  ##

.PHONY: all full cycle
#* means the word "all" doesn't represent a file name in this Makefile;
#* means the Makefile has nothing to do with a file called "all" in the same directory.

all: banner clean cycle;

full: clean-all all;

cycle: rights setup build deploy banner finish-msg;

##  ------------------------------------------------------------------------  ##
