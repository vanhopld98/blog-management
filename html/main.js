let URL = "http://localhost:8080/blogs";
let page = 0;
let count = 0;
let toltalPage = 0;

successHandler();


function clear() {
    $("#author").val("")
    $("#title").val("")
    $("#content").val("")
}

function successHandler() {
    $.ajax({
        url: URL,
        type: 'GET',
        success: function (data) {
            let content = '<thead>\n ' +
                '<tr>\n' +
                '<td scope="col">Id</td>\n' +
                '<td scope="col">Author</td>\n' +
                '<td scope="col">Title</td>\n' +
                '<td scope="col">Content</td>\n' +
                '<td scope="col">Action</td>\n' +
                '</tr>' +
                '</thead>';
            for (let i = 0; i < data.content.length; i++) {
                content += getBlog(data.content[i])
            }
            toltalPage =  data.totalPages;
            $("#countPage").html(page+1)
            $("#list").html(content);
        }
    })
}

function getBlog(blog) {
    return      `
                <tr>
                    <th scope="row">${blog.id}</th>
                    <td>${blog.author}</td>
                    <td>${blog.title}</td>
                    <td>${blog.content}</td>
                    <td>
                        <button onclick="showEdit(${blog.id})" class="btn btn-primary">Update</button>
                        <button onclick="showDelete(${blog.id})" class="btn btn-outline-danger">Delete</button></td>
                </tr>`
}
function searchBlog() {
    let name = $("#form1").val()
    $.ajax({
        url: `${URL}?q=${name}`,
        type: 'GET',
        data: name,
        success: function (data) {
            let content = '<thead>\n ' +
                '<tr>\n' +
                '<td scope="col">Id</td>\n' +
                '<td scope="col">Author</td>\n' +
                '<td scope="col">Title</td>\n' +
                '<td scope="col">Content</td>\n' +
                '<td scope="col">Action</td>\n' +
                '</tr>' +
                '</thead>';
            for (let i = 0; i < data.content.length; i++) {
                content += getBlog(data.content[i])
            }
            $("#list").html(content);
        }
    })
}

function showEdit(id) {
    var myModal = new bootstrap.Modal(document.getElementById('updateModal'));
    myModal.show();
    $.ajax({
        url: URL + `/` + id,
        type: 'GET',
        success: function (data) {
            $("#blogAuthor").val(data.author)
            $("#blogTitle").val(data.title)
            $("#blogContent").val(data.content)
            $('#updateBlog').click(function () {
                update(id)
            });
        }
    })
}

function createBlog() {
    let author = $('#author').val();
    let title = $('#title').val();
    let content = $('#content').val();
    let newBlog = {
        author: author,
        title: title,
        content: content
    };

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        url: URL,
        data: JSON.stringify(newBlog),
        success: function () {
            successHandler();
            clear();
        }
    });
    event.preventDefault();
}

function update(id) {
    let author = $("#blogAuthor").val();
    let title = $("#blogTitle").val();
    let content = $("#blogContent").val();
    let blogUpdate = {
        id: id,
        author: author,
        title: title,
        content: content
    };

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "PUT",
        url: URL + `/` + id,
        data: JSON.stringify(blogUpdate),
        success: successHandler
    });
}
function showDelete(id) {
    let myModal = new bootstrap.Modal(document.getElementById('deleteBlog'));
    myModal.show();
    $.ajax({
        url: URL + `/` + id,
        type: 'GET',
        success: function (data) {
            $("#titleBlogDelete").html(data.title)
            $('#confirmDelete').click(function () {
                remove(id)
            });
        }
    });
}
function remove(id) {
    $.ajax({
        type: "DELETE",
        url: URL + `/${id}`,
        success: successHandler
    });
}

function nextPage() {
    page++
    if(page === toltalPage ){
        $("#nextbtn").hide();
    }
    $("#countPage").html(page+1)
    $.ajax({
       type:"GET",
       url:URL+`?page=${page}`,
       success: function (data){
           let content = '<thead>\n ' +
               '<tr>\n' +
               '<td scope="col">Id</td>\n' +
               '<td scope="col">Author</td>\n' +
               '<td scope="col">Title</td>\n' +
               '<td scope="col">Content</td>\n' +
               '<td scope="col">Action</td>\n' +
               '</tr>' +
               '</thead>';
           for (let i = 0; i < data.content.length; i++) {
               content += getBlog(data.content[i])
           }
           $("#list").html(content);
       }
    });
}
function previousPage() {
    if (page > 0){
        page--;
    }
    $("#countPage").html(page+1)
    $.ajax({
        type:"GET",
        url:URL+`?page=${page}`,
        success: function (data){
            let content = '<thead>\n ' +
                '<tr>\n' +
                '<td scope="col">Id</td>\n' +
                '<td scope="col">Author</td>\n' +
                '<td scope="col">Title</td>\n' +
                '<td scope="col">Content</td>\n' +
                '<td scope="col">Action</td>\n' +
                '</tr>' +
                '</thead>';
            for (let i = 0; i < data.content.length; i++) {
                content += getBlog(data.content[i])
            }
            $("#list").html(content);
        }
    });
}

