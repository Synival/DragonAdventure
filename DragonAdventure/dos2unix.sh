echo "Looking for ASCII files with CRLF..."
num=0
for i in `find . -name "*.cs" -exec file {} \; | grep CRLF | sed "s/:.*//"`; do
    ((num++))
    echo "   $i"
    dos2unix -q $i
done
echo $num files converted.
