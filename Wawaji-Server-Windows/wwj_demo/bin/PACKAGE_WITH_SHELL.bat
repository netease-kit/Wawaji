@echo off

set BIN_DIR=.\release
set PDB_DIR=.\release_pdb

@echo 删除旧文件夹

if exist %BIN_DIR%\ rd %BIN_DIR% /S /Q
if exist %PDB_DIR%\ rd %PDB_DIR% /S /Q

@echo 创建文件夹
md %BIN_DIR%
md %PDB_DIR%

md %BIN_DIR%\res
md %BIN_DIR%\themes
md %BIN_DIR%\lang
md %BIN_DIR%\nim_conf

@echo 按任意键开始复制资源
@pause

@echo 复制二进制模块
copy /Y nim_audio.dll %BIN_DIR%\
copy /Y nim_tools_http.dll %BIN_DIR%\
copy /Y nim.dll %BIN_DIR%\
copy /Y nrtc.dll %BIN_DIR%\
copy /Y nrtc_audio_process.dll %BIN_DIR%\
copy /Y nim_audio_hook.dll %BIN_DIR%\
copy /Y nim_chatroom.dll %BIN_DIR%\

copy /Y nim_wwj.exe %BIN_DIR%\
copy /Y UnInstall.exe %BIN_DIR%\
copy /Y image_ole.dll %BIN_DIR%\
copy /Y translation.bin %BIN_DIR%\
copy /Y app_ver.dll %BIN_DIR%\
copy /Y render.exe %BIN_DIR%\

copy /Y msvcp100.dll %BIN_DIR%\
copy /Y msvcr100.dll %BIN_DIR%\
copy /Y "libx264-150.dll" %BIN_DIR%\
copy /Y "avcodec-57.dll" %BIN_DIR%\
copy /Y "avformat-57.dll" %BIN_DIR%\
copy /Y "avutil-55.dll" %BIN_DIR%\
copy /Y "swresample-2.dll" %BIN_DIR%\
copy /Y "libcrypto-1_1.dll" %BIN_DIR%\
copy /Y "libssl-1_1.dll" %BIN_DIR%\

copy /Y server_conf.txt %BIN_DIR%\

@echo 复制资源
xcopy /Y res\*.* %BIN_DIR%\res\/s /e
xcopy /Y themes\*.* %BIN_DIR%\themes\/s /e
xcopy /Y lang\*.* %BIN_DIR%\lang\/s /e
xcopy /Y live_stream\*.* %BIN_DIR%\live_stream\/s /e

xcopy /Y nim_conf\*.* %BIN_DIR%\nim_conf\/s /e

@echo 复制PDB数据
copy /Y nim_wwj.pdb %PDB_DIR%\
copy /Y duilib.pdb %PDB_DIR%\
copy /Y nim.pdb %PDB_DIR%\
copy /Y nim_tools_http.pdb %PDB_DIR%\
copy /Y nim_audio.pdb %PDB_DIR%\
copy /Y nrtc.pdb %PDB_DIR%\
copy /Y nrtc_audio_process.pdb %PDB_DIR%\
copy /Y nim_audio_hook.pdb %PDB_DIR%\
copy /Y nim_chatroom.pdb %PDB_DIR%\
copy /Y image_ole.pdb %PDB_DIR%\

@echo 打包完成！
@pause
