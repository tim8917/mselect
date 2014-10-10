$(function(){

    $.widget("nmk.mselect",{
        elementBody: {},
        options: {
            tagLayout: '<li class="tag"><span class="tagBody"/><a class="tagClose"/></a>',
            containerInnerLayout: '<div class="barLeft"><span class="leftArrow"/></div><ul class="barBody"/><div class="barRight"><span class="rightArrow"/></div>'
        },
        _create: function() {
            var widget = this,
                elementsCount = this.options.elementsCount,
                container = this.element,
                items = container.children();
                tagLayout = this.options.tagLayout,
                containerInnerLayout = this.options.containerInnerLayout;

            container.addClass("mselect").append(containerInnerLayout);
            var elementBody = this.elementBody = $(container.find('.barBody'));

            $.each(items,function(index,value){
                widget.addTag($(value).text());
            });
            items.remove();

            $(elementBody).on('click', '.tagClose' ,function(){
                var index = elementBody.find('.tag').index($(this).parents('.tag'));
                widget._closeTag(index);
            });

            $(this.element).find('.barRight:first').on('click',function(){
                widget._moveRight();
            });

            $(this.element).find('.barLeft:first').on('click',function(){
                widget._moveLeft();
            });

        },
        addTag: function(caption){
            var newTag = $(this.options.tagLayout);
            newTag.find('.tagBody').text(caption);
            this._addTag(newTag);
        },
        _closeTag:function(index){
            this.elementBody.find(".tag:eq("+index+")").remove();
        },
        _addTag: function(newTag){
            this.elementBody.append(newTag);
        },
        _removeTag: function(){

        },
        _focusTag: function(position,index){

        },
        _moveRight: function(){
            this._move('right');
        },
        _moveLeft: function(){
            this._move('left');
        },
        _move: function(direction){
            var firstTag = $(this.elementBody.find('.tag:first')),
                restTags = $(this.elementBody.find('.tag:gt(0)')),
                tag,gap,marginLeft;
            switch(direction){
                case 'left':
                    tag = this._findHiddenTag(direction);
                    if(tag != false){
                        gap = Math.abs(this._getOffsetLeft(tag) - this._getOffsetLeft(this.elementBody));
                        marginLeft = "+="+gap+"px";
                    }
                    break;
                case 'right':
                    tag = this._findHiddenTag(direction);
                    if(tag != false){
                        gap = Math.abs(this._getOffsetRight(tag) - this._getOffsetRight(this.elementBody));
                        marginLeft = "-="+gap+"px";
                    }
                    break;
            }
            var an = firstTag
                .dequeue()
                .animate({'marginLeft': marginLeft},{
                });
//                        ,function(){
//                            $(this).queue(function(){});
//                        });


        },
        _findHiddenTag: function(where){
            var tags = this.elementBody.find('.tag'),
                i;
            switch(where){
                case 'left':
                    var getOffsetLeft = this._getOffsetLeft,
                        elementBodyLeft = getOffsetLeft(this.elementBody);
                    for(i=tags.length-1; i>=0; i--){
                        if(getOffsetLeft(tags[i])<elementBodyLeft){
                            return tags[i];
                        }
                    }
                    break;
                case 'right':
                    var getOffsetRight = this._getOffsetRight,
                        elementBodyRight = getOffsetRight(this.elementBody);
                    for(i=0; i<tags.length; i++){
                        if(getOffsetRight(tags[i])>elementBodyRight){
                            return tags[i];
                        }
                    }
                    break;
            }

            return false;
        },
        _getOffsetLeft: function(element){
            var el = $(element);
            return el.offset().left;
        },
        _getOffsetRight: function(element){
            var el = $(element);
            return el.offset().left + parseInt(el.css('width'));
        }
    });


});