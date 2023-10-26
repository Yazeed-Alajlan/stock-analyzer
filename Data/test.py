import sys, json
import pandas as pd


def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

def main():
    lines = read_in()
    array1=[1,2,3,4,5]
    array2=["a","b","c","d","e"]

    df=pd.DataFrame({"onecolumn": lines,
    "second":array1,
    "third": array2
    })

    print (df)

if __name__ == '__main__':
    main()