for y in `ls 808`; do
echo "\"trap_$y\": ["
for x in `ls 808/$y`; do echo "\"trap/$y/"$x"\","; done
echo "],\n"
done;
