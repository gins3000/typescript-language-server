/* --------------------------------------------------------------------------------------------
 * Copyright (c) TypeFox and others. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import { RequestType, RequestHandler } from 'vscode-jsonrpc';
import { Location, SymbolKind, Range, DocumentSymbol } from 'vscode-languageserver-types';
import * as lsp from 'vscode-languageserver';

export interface CallHierarchyClientCapabilities {
    /**
     * The text document client capabilities
     */
    textDocument?: {
        /**
         * Capabilities specific to the `textDocument/callHierarchy`
         */
        callHierarchy?: {
            /**
             * Whether implementation supports dynamic registration. If this is set to `true`
             * the client supports the new `(TextDocumentRegistrationOptions & StaticRegistrationOptions)`
             * return value for the corresponding server capability as well.
             */
            dynamicRegistration?: boolean;
        };
    }
}

export interface CallHierarchyServerCapabilities {
    /**
     * The server provides Call Hierarchy support.
     */
    callHierarchyProvider?: boolean | (lsp.TextDocumentRegistrationOptions & lsp.StaticRegistrationOptions);
}

/**
 * Request to request or resolve the call hierarchy at a given text document position.
 *
 * The request's parameter for the first request is of type [CallHierarchyParams](#CallHierarchyParams). The request's
 * parameter for the following requests is of type [ResolveCallHierarchyItemParams](#ResolveCallHierarchyItemParams).
 *
 * The first request returns an item for the given cursor position.
 *
 * The response is of type [CallHierarchyItem](#CallHierarchyItem) or a Thenable that resolves to such.
 */
export namespace CallHierarchyRequest {
    export const type = new RequestType<CallHierarchyParams, ResolveCallHierarchyItemParams, void, lsp.TextDocumentRegistrationOptions>('textDocument/callHierarchy');
    export type HandlerSignature = RequestHandler<CallHierarchyParams | ResolveCallHierarchyItemParams, CallHierarchyItem | null, void>;
}

/**
 * The parameters of a `textDocument/callHierarchy` request.
 */
export interface CallHierarchyParams extends lsp.TextDocumentPositionParams {
    resolve?: number; // the levels to resolve.
    /**
     * Outgoing direction for callees.
     * The default is incoming for callers.
     */
    direction?: 'incoming' | 'outgoing';
}

/**
 * The parameters of a `textDocument/callHierarchy` request.
 */
export interface ResolveCallHierarchyItemParams {
    item: CallHierarchyItem;
    resolve: number; // the levels to resolve.
    /**
     * Outgoing direction for callees.
     * The default is incoming for callers.
     */
    direction: 'incoming' | 'outgoing';
}

/**
 * The result of a `textDocument/callHierarchy` request.
 */
export interface CallHierarchyItem {
    /**
     * The name of the symbol targeted by the call hierarchy request.
     */
    name: string;
    /**
     * More detail for this symbol, e.g the signature of a function.
     */
    detail?: string;
    /**
     * The kind of this symbol.
     */
    kind: SymbolKind;
    /**
     * URI of the document containing the symbol.
     */
    uri: string;
    /**
     * The range enclosing this symbol not including leading/trailing whitespace but everything else
     * like comments. This information is typically used to determine if the the clients cursor is
     * inside the symbol to reveal in the symbol in the UI.
     */
    range: Range;
    /**
     * The range that should be selected and revealed when this symbol is being picked, e.g the name of a function.
     * Must be contained by the the `range`.
     */
    selectionRange: Range;

    /**
     * The actual location of the call.
     *
     * Must be defined in resolved callers/callees.
     */
    callLocation?: Location;

    /**
     * List of incoming calls.
     *
     * *Note*: The items is _unresolved_ if `callers` and `callees` is undefined.
     */
    callers?: CallHierarchyItem[];
    /**
     * List of outgoing calls.
     *
     * *Note*: The items is _unresolved_ if `callers` and `callees` is undefined.
     */
    callees?: CallHierarchyItem[];
}
