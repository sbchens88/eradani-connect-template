# Variables

libdir = /qsys.lib/$(LIB).lib

PGMS = $(libdir)/HELLO.PGM \
       $(libdir)/LINUX_CALC.PGM

rootdir = $(shell pwd)

sshhost = eradani-lpar-root

ifndef LIB
	$(error Please define the LIB environment variable and try again)
endif

# Rules

all: $(PGMS)

# Programs

$(libdir)/HELLO.PGM: hello.rpgle
	system "CHGATR OBJ('$(rootdir)/hello.rpgle') ATR(*CCSID) VALUE(819)"
	system "CRTBNDRPG PGM($(LIB)/HELLO) SRCSTMF('$<')"

$(libdir)/LINUX_CALC.PGM: linux_calc.rpgle
	system "CHGATR OBJ('$(rootdir)/linux_calc.rpgle') ATR(*CCSID) VALUE(819)"
	system "CRTBNDRPG PGM($(LIB)/LINUX_CALC) SRCSTMF('$<')"

.PHONY: init
init:
	-system "CRTLIB $(LIB)"

.PHONY: clean
clean:
	-system "DLTPGM PGM($(LIB)/HELLO)"
	-system "DLTPGM PGM($(LIB)/LINUX_CALC)"
