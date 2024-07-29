from cx_Freeze import setup, Executable

executableApp = Executable(
    script="speech-server.py",
    target_name="pyapp",
)

options = {
    "build_exe": {
        "build_exe":"./dist/",
        "excludes": ["*.txt"],
        "optimize": 2,
    }
}

setup(
    name="pyapp",
    version="1.0",
    description="python app",
    options=options,
    executables=[executableApp]
)