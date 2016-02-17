import Node from '../syntax/node';
import NodeKind from '../syntax/nodeKind';
import * as Operators from '../syntax/operators';
import * as Keywords from '../syntax/keywords';
import AS3Parser, {nextToken, consume, tokIs, VECTOR} from './parser';
import {parseQualifiedName} from './parse-common';


/**
 * if tok is ":" parse the type otherwise do nothing
 */
export function parseOptionalType(parser:AS3Parser):Node {
    let result:Node = new Node(NodeKind.TYPE, parser.tok.index, parser.tok.index, '');
    if (tokIs(parser, Operators.COLUMN)) {
        nextToken(parser, true);
        result = parseType(parser);
    }
    return result;
}

export function parseType(parser:AS3Parser):Node {
    let result:Node;
    if (parser.tok.text === VECTOR) {
        result = parseVector(parser);
    } else {
        let index = parser.tok.index,
            name = parseQualifiedName(parser, true);
        result = new Node(NodeKind.TYPE, index, index + name.length, name);
        // nextToken(parser,  true );
    }
    return result;
}

export function parseVector(parser:AS3Parser):Node {
    let result:Node = new Node(NodeKind.VECTOR, parser.tok.index, -1, '');
    if (parser.tok.text === VECTOR) {
        nextToken(parser);
    }
    consume(parser, Operators.VECTOR_START);

    result.children.push(parseType(parser));

    result.end = consume(parser, Operators.SUPERIOR).end;

    return result;
}
