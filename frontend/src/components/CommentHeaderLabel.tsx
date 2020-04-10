import * as React from 'react';
import { CommentHeaderLabelProps } from '../props';

class CommentHeaderLabel extends React.Component<CommentHeaderLabelProps, {}> {
    render() {
        let assoc = this.props.authorAssociation;
        if (assoc !== 'NONE') {
            let className = AUTHOR_ASSOCIATION_STRONG[assoc] ? 'comment-header-label strong' : 'comment-header-label';
            let text = this.props.authorAssociation.toLocaleLowerCase().replace(/^\w/, c => c.toUpperCase());
            return (
                <span className={className}>{text}</span>
            );
        }
        return (null);
    }
}

const AUTHOR_ASSOCIATION_STRONG: { [id: string] : boolean; } = {
    'COLLABORATOR': false,
    'CONTRIBUTOR': false,
    'FIRST_TIMER': false,
    'FIRST_TIME_CONTRIBUTOR': false,
    'MEMBER': true,
    'NONE': false,
    'OWNER': true
}

export default CommentHeaderLabel;