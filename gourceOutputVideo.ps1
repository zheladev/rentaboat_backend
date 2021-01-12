gource -s .06 -1280x720 --auto-skip-seconds .1 --multi-sampling --stop-at-end --key --highlight-users --hide mouse,progress,files,filenames,dirnames --file-idle-time 0     --max-files 0      --background-colour 000000     --font-size 22     --title "Lucene/Solr" --output-ppm-stream output.ppm  --output-framerate 30 
ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i output.ppm  -vcodec wmv1 -r 60 -qscale 0 out.wmv