{ name = "test"
, dependencies =
    [ "console"
    , "effect"
    , "prelude"
    ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}

