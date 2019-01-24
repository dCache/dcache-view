Shipped Features in dCache View
----------------------------------

Here are list of features available inside dCache View
<table>
    <tr>
        <th>#</th>
        <th>Feature</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>1.</td>
        <td align="center">
            <p>Listing</p>
            <p>&</p>
            <p>Navigation</p>
        </td>
        <td align="justify">
            See the content of a directory with the possibilities of viewing the sub directories
            as well. Double-click any directory or right-click on it and select <b>open</b> from
            the context menu to view its contents.
        </td>
    </tr>
    <tr>
        <td>2.</td>
        <td align="center">Viewer</td>
        <td align="justify">
            Quickly see the content of a file inside dCache View with built-in viewer. To view
            the content of a file, simply click on it and right-click or just right-click and
            select <b>view</b>, <b>play</b> or <b>open</b> (this depends on the type of file).
            <p>At the moment, you can view:</p>
            <div>
                <ul>
                    <li>
                        Portable Document Format file, that is, files with .pdf extension
                    </li>
                    <li>
                        video files with these file extension:
                        <code>.ogg, .mpeg, .webm and .mp4</code>
                    </li>
                    <li>
                        image files with these file extension:
                        <code>.gif, .jpeg, .png, .x-icon and svg+xml</code>
                    </li>
                </ul>
            </div>
            <small>More file mime-types will be supported later.</small>
        </td>
    </tr>
    <tr>
        <td>3.</td>
        <td align="center">
            <p>Authentication</p>
            <p>&</p>
            <p>Authorisation</p>
        </td>
        <td align="justify">
            There are four options of authentication that are currently supported, these
            are: certificate, openID connect, macaroon and username+password.
        </td>
    </tr>
    <tr>
        <td>4.</td>
        <td align="center">File Metadata</td>
        <td align="justify">
            Get more details and information about a file or directory properties.
            To view the file Metadata, right-click the file and select <b>View details</b>
            from the context menu. You can also select the file and click info button.
            The file metadata dashboard will be open with the file's properties inside
            it, user can decide to view it in raw or formatted form.
        </td>
    </tr>
    <tr>
        <td>5.</td>
        <td align="center">Create directory</td>
        <td align="justify">
            Create an empty directory. Either by clicking the create button or
            right-click inside the directory that will serve as the parent and select
            <b>create new directory</b> from the context menu.
        </td>
    </tr>
    <tr>
        <td>6.</td>
        <td align="center">Upload</td>
        <td align="justify">
            Upload file/s or directory/ies (depending on the browser) into a directory.
            This can be done by either dragging the file/s and dropping it into the
            desired directory or by using the upload button, which allow user to select
            one or more files from their device storage.
        </td>
    </tr>
    <tr>
        <td>7.</td>
        <td align="center">Move</td>
        <td align="justify">
            Change the parent of one or more files by either dragging the selected file
            into the destination directory (which will be the new parent), or by clicking
            the move button, which will be shown only if file/s are selected.
        </td>
    </tr>
    <tr>
        <td>8.</td>
        <td align="center">Rename</td>
        <td align="justify">
            Rename a file or folder. Right-click on the file and select <b>Rename</b>
            from the context menu. When you rename a file, only the first part of the
            name of the file is selected, not the file extension (the part after the
            last .) and you usually do not want to change that. If you need to change
            the extension as well, select the entire file name and change it. The
            following are worth noting:
            <ol>
                <li>
                    You can use any character except the / (slash) character in file names.
                </li>
                <li>
                    You cannot have two files or directory with the same name in the same
                    directory. If you try to rename a file to a name that already exists
                    in the folder you are working in, dCache will not allow it.
                </li>
                <li>
                    File and directory names are case sensitive, so the file name
                    Test-File.txt is not the same as TEST-FILE.txt.
                </li>
            </ol>
        </td>
    </tr>
    <tr>
        <td>9.</td>
        <td align="center">Download</td>
        <td align="justify">
            Download a file, right-click it and select <b>Download</b> from the
            context menu.
        </td>
    </tr>
    <tr>
        <td>10.</td>
        <td align="center">Delete</td>
        <td align="justify">
            Deleting a file remove it in a directory. Select the file you want to delete
            by clicking and (or) right-click it then select <b>Delete</b> from the context
            menu. Also, multiple files can be selected for this operation and only an empty
            directory can be deleted.
        </td>
    </tr>
    <tr>
        <td>11.</td>
        <td align="center">Sharing</td>
        <td align="justify">
            Send files to anyone, even if they don’t have an account. To share a file,
            click and (or) right-click on it then select <b>Share</b> from the
            context menu. A dialog box will be shown, which provide different options
            that can be set in terms of permission and duration for the shared file.
            <p>
                When you click on <b>Generate</b> button, a macaroon, a shared file
                link and a QR code for the shared file link  will be created. Any of
                these can be use to share a file with someone.
            </p>
            <p>
                To view or download a shared file. Copy and pasted the link sent to
                you inside the browser and dCache View will handle the rest. If it
                is a macaroon that was sent to you; go to the dCache View page and
                clicked <i>shared-files</i>, which is the orange circular button on
                the left hand side of your screen. On that page, click the circular
                button with the cross icon at bottom right of the screen. A "<b>Add
                a Shared File</b>" dialog box will be shown, paste the macaroon
                inside the text box and click the add button.
            </p>
            <small>
                See <a href="">how to share and view shared files</a> for more 
                details.
            </small>
        </td>
    </tr>
    <tr>
        <td>12.</td>
        <td align="center">Context menu</td>
        <td align="justify">
            Provide list of possible actions or operations that can be perform
            or a file(s) or directory(ies). Also, provide a way to retrieve
            some backend information.
        </td>
    </tr>
    <tr>
        <td>13.</td>
        <td align="center">
            <p>Keyboard Shortcuts</p>
            <p>&</p>
            <p>Multiple selection</p>
        </td>
        <td align="justify">
            Support shortcuts for multiple selection, like:
            <table>
                <tr>
                    <td>Key or Key Combination</td>
                    <td>What it does</td>
                </tr>
                <tr>
                    <td>Click on a file + up arrow key</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Click on a file + down arrow key</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Control (or Command for Mac) key + mouse click</td>
                    <td></td>
                </tr>
                <tr>
                    <td>
                        Shift key + mouse click
                    </td>
                    <td></td>
                </tr>
                <tr>
                    <td>
                        Shift or Control (or Command for Mac) key with the up arrow key
                    </td>
                    <td></td>
                </tr>
                <tr>
                    <td>
                        Shift or Control (or Command for Mac) key with the down arrow key
                    </td>
                    <td></td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td>14.</td>
        <td align="center">Drag & drop</td>
        <td align="justify">
            Use drag and drop to move or upload file/s.
        </td>
    </tr>
    <tr>
    <tr>
        <td>15.</td>
        <td align="center">Quality of service</td>
        <td align="justify">
            View the backend capabilities by right-clicking inside
            and able to update or modify specific file QoS
        </td>
    </tr>
    <tr>
        <td>16.</td>
        <td align="center">User profile</td>
        <td align="justify">
            Shows detail user information with some few knobs that user can use
            to set or remove some certain preferences.
        </td>
    </tr>
</table>
