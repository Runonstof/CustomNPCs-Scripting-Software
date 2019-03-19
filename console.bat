@echo off
color F8
title Custom NPCs console

echo /---------------------------\
echo ^|    Custom NPCs console    ^|
echo ^|       By: Runonstof       ^|
echo ^|---------------------------/
echo ^|
:start
echo ^|
set /p cc="|-Custom NPCs> "
cls
echo /---------------------------\
echo ^|    Custom NPCs console    ^|
echo ^|       By: Runonstof       ^|
echo ^|---------------------------/
echo ^|
php %cc%
goto start